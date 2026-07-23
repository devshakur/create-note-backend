import { prisma } from "../config/db.js";
import { AppError } from "../middlewares/errorHandler.js";

const VALID_PERIODS = ["today", "week", "month", "year"];

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysAgo = (days) => {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - days);
  return d;
};

const PERIOD_RANGES = {
  today: () => ({
    gte: startOfDay(new Date()),
    lt: daysAgo(-1),
  }),
  week: () => ({ gte: daysAgo(7) }),
  month: () => ({ gte: daysAgo(30) }),
  year: () => ({ gte: daysAgo(365) }),
};

const validatePeriod = (period) => {
  if (period === undefined || period === "") return;

  if (!VALID_PERIODS.includes(period)) {
    throw new AppError(
      `Invalid period. Allowed values: ${VALID_PERIODS.join(", ")}`,
      400
    );
  }
};

export const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildNoteFilter = (userId, query) => {
  const { search, period } = query;
  validatePeriod(period);

  const filter = { userId };

  if (search?.trim()) {
    const term = search.trim();
    filter.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { content: { contains: term, mode: "insensitive" } },
    ];
  }

  if (period) {
    filter.createdAt = PERIOD_RANGES[period]();
  }

  return filter;
};

export const getPaginatedNotes = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = buildNoteFilter(userId, query);

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.note.count({ where }),
  ]);

  return {
    notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

// fake stripe copy
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

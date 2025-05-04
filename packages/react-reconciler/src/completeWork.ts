import { FiberNode } from "./fiber";

// 递归的归阶段，向上收集副作用，处理DOM操作
export const completeWork = (fiberNode: FiberNode) => {
  return fiberNode;
};

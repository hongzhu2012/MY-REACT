import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { HostRoot } from "./workTags";

// 当前正在处理的Fiber节点(工作单元)
let workInProgress: FiberNode | null = null;

/**
 * 初始化工作栈，设置当前fiber节点为根Fiber节点
 * @param fiber
 */
function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 处理单个Fiber节点
 * @param fiber
 */
function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber); // 生成子节点
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node?.return;
    workInProgress = node;
  } while (node !== null);
}

// 执行初始化
function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);

  try {
    workLoop();
  } catch (e) {
    console.warn("workLoop发生错误：", e);
    workInProgress = null;
  }
}

// 工作循环
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// 调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  const node = fiber;
  let parent = node.return;
  while (parent !== null) {
    fiber = parent;
    parent = fiber.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

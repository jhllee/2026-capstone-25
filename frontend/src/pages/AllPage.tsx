import { useState } from "react";
import { listTasks, setTaskDone, type Task } from "../services/tasks";

export default function AllPage() {
  const [tasks, setTasks] = useState<Task[]>(() => listTasks());

  function toggleDone(id: string, done: boolean) {
    setTaskDone(id, done);
    setTasks(listTasks());
  }

  if (tasks.length === 0) {
    return (
      <div className="px-4 lg:px-8 py-16 max-w-[720px] mx-auto w-full text-center">
        <div className="text-5xl mb-4">📋</div>
        <div className="text-lg font-bold text-tx mb-2">아직 할 일이 없어요</div>
        <div className="text-sm text-mu">홈에서 첫 번째 할 일을 만들어보세요</div>
      </div>
    );
  }

  // 미완료 먼저 → 마감일 가까운 순 → 최근 추가 순
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const ad = a.dueDate || "9999-12-31";
    const bd = b.dueDate || "9999-12-31";
    if (ad !== bd) return ad < bd ? -1 : 1;
    return b.createdAt - a.createdAt;
  });

  const ongoing = tasks.filter((t) => !t.done).length;
  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[720px] mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-tx mb-2">나의 할 일</h1>
        <div className="flex gap-4 text-xs text-mu">
          <span>
            진행중 <span className="font-bold text-tx2">{ongoing}</span>
          </span>
          <span>
            완료 <span className="font-bold text-tx2">{completed}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={toggleDone} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
}) {
  return (
    <div className="bg-sf border border-bd2 rounded-xl px-4 py-[14px] flex items-center gap-3">
      {task.isSingle && (
        <button
          type="button"
          onClick={() => onToggle(task.id, !task.done)}
          aria-pressed={task.done}
          aria-label={task.done ? "완료 해제" : "완료 표시"}
          className={[
            "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer",
            task.done
              ? "bg-ac border-ac text-white"
              : "bg-transparent border-mu hover:border-ac",
          ].join(" ")}
        >
          {task.done && <span className="text-[12px] font-bold leading-none">✓</span>}
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div
          className={[
            "text-sm font-bold leading-[1.4] break-keep",
            task.done ? "text-mu line-through" : "text-tx",
          ].join(" ")}
        >
          {task.title}
        </div>
        <div className="text-[11px] text-mu mt-1 flex gap-2">
          {task.isSingle && <span>단일 작업</span>}
          {task.dueDate && <span>· 마감 {task.dueDate}</span>}
        </div>
      </div>
    </div>
  );
}

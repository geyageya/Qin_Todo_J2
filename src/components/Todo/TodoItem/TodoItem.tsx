import type { ChangeEvent, Dispatch, KeyboardEventHandler, SetStateAction, VFC } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { PlusBtn } from "src/components/btn/PlusBtn";
import { RadioBtn } from "src/components/btn/RadioBtn/RadioBtn";

export type Task = {
  readonly id: string;
  task?: string;
  checked: boolean;
};

type TodoItemProps = {
  task: string;
  setTaskList: Dispatch<SetStateAction<Task[]>>;
  readonly id: string;
  checked: boolean;
};

export const TodoItem: VFC<TodoItemProps> = (props) => {
  const [task, setTask] = useState<string>("");

  useEffect(() => {
    setTask(props.task);
  }, [props.task]);

  const getUniqueId = () => {
    return new Date().getTime().toString(36) + "-" + Math.random().toString(36);
  };

  const handleChangeTask = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //taskの中に'\n'が入っているため取り除く処理
    const task = e.target.value.replace("\n", "");
    setTask(task);
  };
  //textareaの高さ自動（WIP）
  // const calcTextAreaHeight = (task: string) => {
  //     const rowsNum: number = task.split('\n').length;
  //     return rowsNum
  //   }

  //最大200文字まで書き込み、それ以上は入力文字数制限
  const handleCountChange = (e: any) => {
    const truncate = (str: string, length: number) => {
      return str.length >= length ? alert("入力可能な文字数を超えています。") : str;
    };
    truncate(e.target.value, 200);
  };

  const handleOnKeyDown = useCallback(
    (e: KeyboardEventHandler<HTMLTextAreaElement> | undefined | any) => {
      if (e.key === "Enter") {
        const newId = getUniqueId();
        props.setTaskList((prev) => {
          return [
            {
              id: newId,
              task,
              checked: false, //景谷
            },
            ...prev,
          ];
        });
        //初期化することで前の内容のコピーを防ぐ
        setTask("");
      }
      return;
    },
    [task, props]
  );
  //タスクの完了/未完了を操作する関数
  const handleOnCheck = () => {
    props.setTaskList((prevTaskList) => {
      const newTaskList = prevTaskList.map((item: Task) => {
        if (item.id === props.id) {
          return { ...item, checked: !item.checked };
        }
        return { ...item };
      });
      return newTaskList;
    });
  };

  return (
    <div className="flex flex-row pb-1 pl-1">
      {task === "" ? <PlusBtn /> : <RadioBtn variant="rose" value="task1" />}
      <textarea
        placeholder="タスクを追加する"
        // rows={calcTextAreaHeight(task)}
        value={task}
        maxLength={200}
        onKeyUp={handleCountChange}
        onChange={handleChangeTask}
        onKeyDown={handleOnKeyDown}
        //イベントハンドラー（タスクの完了/未完了を操作）
        // eslint-disable-next-line react/jsx-handler-names
        onClick={handleOnCheck}
        className={`
                  overflow-hidden
                  mt-3
                  focus:outline-none
                  caret-[#F43F5E]
                  resize-none
                  // 景谷
                  ${
                    //タスクの完了/未完了に合わせ、タスクに横線をつける/消す
                    props.checked === true ? "line-through" : ""
                  }
                  `}
      />
    </div>
  );
};

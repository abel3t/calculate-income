import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

export default function Home() {
  const [data, setData] = useState([] as any);
  const [command, setCommand] = useState("");
  const MAX_CARDS = 10;

  useEffect(() => {
    const lsData = JSON.parse(localStorage.getItem("data") || "[] ");

    if (lsData?.length) {
      setData(lsData);
    } else {
      const initData = [];
      for (let i = 0; i < MAX_CARDS; i++) {
        initData.push({
          order: i + 1,
          amounts: [],
        });
      }

      setData(initData);
    }
  }, []);

  const handleReset = () => {
    localStorage.clear();

    location.reload();
  };

  const handlePresKey = (event: any) => {
    if (event?.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = () => {
    const [first, last] = command.split(":");
    const order = parseInt(first);
    const amount = parseInt(last);
    const amounts = data[order - 1]?.amounts || [];

    if (!order || order <= 0 || order > MAX_CARDS || !amount) {
      alert("Đã xảy ra lỗi, vui lòng thử lại");
      setCommand("");
      return;
    }

    const newData: any = [];

    data.forEach((x: any) => {
      if (x.order !== order) {
        newData.push(x);
      } else {
        const newCard = { order, amounts: [amount].concat(amounts) };
        newData.push(newCard);
      }
    });

    localStorage.setItem("data", JSON.stringify(newData));
    setData(newData);

    document.getElementById(`card-${order}`)?.scrollIntoView({
      block: "nearest",
      behavior: "auto",
      inline: "nearest",
    });

    setCommand("");
  };

  return (
    <div className="flex flex-col w-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
      <div className="fixed flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
        <input
          className="flex items-center h-10 w-24 px-4 text-sm bg-gray-200 rounded-lg focus:outline-none focus:ring"
          type="search"
          placeholder="1:100"
          autoFocus={true}
          value={command}
          onChange={(e) => setCommand(e.target?.value || "")}
          onKeyDown={handlePresKey}
        />

        <button
          type="button"
          className="ml-3 bg-blue-400 px-2 py-1 border rounded-md"
          onClick={handleClick}
        >
          Ok
        </button>

        <button
          type="button"
          className="ml-5 bg-gray-400 px-2 py-1 border rounded-md"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-grow space-x-2 overflow-x-scroll px-1">
        {data.map((x: any) => (
          <Card key={x.order} {...x} />
        ))}
      </div>
    </div>
  );
}

const Card = ({
  amounts,
  order
}: {
  amounts: number[];
  order: number;
  cardRef: any;
}) => {
  return (
    <div className="card flex flex-col flex-shrink-0 w-14 py-20 mx-2" id={`card-${order}`}>
      <div className="flex h-10 px-1">
        <span className="block text-sm font-semibold">{order}</span>
        <span className="block ml-2 text-sm font-semibold">
          <SummaryAmount amounts={amounts} />
        </span>
      </div>

      <div className="flex flex-col overflow-y-scroll h-72">
        <div className="flex flex-col items-center p-1 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100">
          <h4 className="mt-3 text-sm font-medium">
            {amounts.map((amount, index) => {
              return (
                <div
                  className={classNames({
                    "text-green-500": amount > 0,
                    "text-red-500": amount < 0,
                    "text-yellow-500": !amount,
                  })}
                  key={index}
                >
                  {amount}
                </div>
              );
            })}
          </h4>
        </div>
      </div>

      <div className="relative flex flex-col items-center p-1 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100">
        <SummaryAmount amounts={amounts} />
      </div>
    </div>
  );
};

const SummaryAmount = ({ amounts }: { amounts: any }) => {
  const sumAmount = amounts.reduce((curr: any, acc: any) => acc + curr, 0);
  return (
    <h4
      className={classNames({
        "text-sm font-medium text-green-600": sumAmount > 0,
        "text-sm font-medium text-red-600": sumAmount < 0,
        "text-sm font-medium text-yellow-600": !sumAmount,
      })}
    >
      {sumAmount}
    </h4>
  );
};

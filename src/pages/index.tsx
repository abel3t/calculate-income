import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

export default function Home() {
  const [data, setData] = useState([] as any);
  const [command, setCommand] = useState("");

  const cardRef: any = useRef<any | null>(null);


  useEffect(() => {
    const lsData = JSON.parse(localStorage.getItem("data") || "[] ");

    if (lsData?.length) {
      setData(lsData);
    } else {
      const initData = [];
      for (let i = 0; i < 7; i++) {
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

    if (!order || order <= 0 || order > 7 || !amount) {
      alert("Đã xảy ra lỗi, vui lòng thử lại");
      setCommand("");
      return;
    }

    const newData: any = [];

    data.forEach((x: any) => {
      if (x.order !== order) {
        newData.push(x);
      } else {
        const newCard = { order, amounts: amounts.concat(amount) };
        newData.push(newCard);
      }
    });

    localStorage.setItem("data", JSON.stringify(newData));
    setData(newData)

    console.log( cardRef.current)
    

    cardRef.current?.scrollIntoView({ behavior: 'smooth'}),

    setCommand("");
  };

  return (
    <main className={`flex min-h-screen`}>
      <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
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

        <div className="flex flex-grow px-2 mt-4 space-x-1 overflow-auto">
          {data.map((x: any) => (
            <Card key={x.order} {...x} cardRef={cardRef} />
          ))}
        </div>
      </div>
    </main>
  );
}

const Card = ({ amounts, order, cardRef }: { amounts: number[]; order: number, cardRef: any }) => {
  return (
    <div className="card flex flex-col flex-shrink-0 w-16">
      <div className="flex  h-10 px-2">
        <span className="block text-sm font-semibold">{order}</span>
        <span className="block ml-2 text-sm font-semibold">
          <SummaryAmount amounts={amounts} />
        </span>
      </div>

      <div className="flex flex-col pb-2 overflow-y-scroll h-72">
        <div className="flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100">
          <h4 className="mt-3 text-sm font-medium">
            {amounts.map((amount, index) => (
              <div
                className={classNames({
                  "text-green-400": amount > 0,
                  "text-red-400": amount < 0,
                  "text-yellow-400": !amount,
                })}
                ref={cardRef}
                key={index}
              >
                {amount}
              </div>
            ))}
          </h4>
          </div>
      </div>

      <div className="flex flex-col pb-2 overflow-auto">
        <div className="flex flex-col pb-2 overflow-auto">
          <div className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100">
            <SummaryAmount amounts={amounts} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryAmount = ({ amounts }: { amounts: any }) => {
  const sumAmount = amounts.reduce((curr: any, acc: any) => acc + curr, 0);
  return (
    <h4
      className={classNames({
        "text-sm font-medium text-green-400": sumAmount > 0,
        "text-sm font-medium text-red-400": sumAmount < 0,
        "text-sm font-medium text-yellow-400": !sumAmount,
      })}
    >
      {sumAmount}
    </h4>
  );
};

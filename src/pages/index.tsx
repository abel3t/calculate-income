import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([] as any);
  const [command, setCommand] = useState("");

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
  }

  const handleClick = () => {
    const [first, last] = command.split(" ");
    const order = parseInt(first);
    const amount = parseInt(last);
    const amounts = data[order - 1]?.amounts || [];

    const newData: any = [];

    data.forEach((x: any) => {
      if (x.order !== order) {
        newData.push(x);
      } else {
        const newCard = { order, amounts: amounts.concat(amount) };
        newData.push(newCard);
      }
    })


    setData(newData);

    setCommand("");

    localStorage.setItem(data, JSON.stringify(data));
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between`}
    >
      <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
          <input
            className="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring"
            type="search"
            placeholder="nhap lenh"
            value={command}
            onChange={(e) => setCommand(e.target?.value || "")}
          />

          <button type="button" className="ml-3" onClick={handleClick}>
            Ok
          </button>

          <button type="button" className="ml-5" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
          {data.map((x: any) => (
            <Card key={x.order} {...x} />
          ))}
        </div>
      </div>
    </main>
  );
}

const Card = ({ amounts, order }: { amounts: number[]; order: number }) => {
  return (
    <div className="flex flex-col flex-shrink-0 w-16">
      <div className="flex items-center flex-shrink-0 h-10 px-2">
        <span className="block text-sm font-semibold">{order}</span>
      </div>
      <div className="flex flex-col pb-2 overflow-auto">
        <div className="flex flex-col pb-2 overflow-auto">
          <div
            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
            draggable="true"
          >
            <h4 className="mt-3 text-sm font-medium">
              {amounts.map((amount, index) => (
                <div key={index}>{amount}</div>
              ))}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-2 overflow-auto">
        <div className="flex flex-col pb-2 overflow-auto">
          <div
            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
          >
            <h4 className="mt-3 text-sm font-medium">
              {amounts.reduce((curr, acc) => acc + curr, 0)}
            </h4>
          </div>
        </div>
      </div>

    </div>
  );
};

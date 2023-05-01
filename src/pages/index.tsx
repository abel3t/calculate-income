import { useEffect, useState } from "react";
import classNames from "classnames";

enum SideType {
  Red,
  Green,
}

const SideText = {
  [SideType.Red]: "Đ",
  [SideType.Green]: "X",
};

enum AmountType {
  Normal,
  Bet,
}

interface IAmount {
  type: AmountType;
  side?: SideType | undefined;
  value: number;
}

interface ICard {
  order: number;
  name: string;
  amounts: IAmount[];
}

export default function Home() {
  const [data, setData] = useState([] as ICard[]);
  const [command, setCommand] = useState("");
  const MAX_CARDS = 10;

  useEffect(() => {
    const lsData = JSON.parse(localStorage.getItem("data") || "[] ");

    if (lsData?.length) {
      setData(lsData);
    } else {
      const initData: ICard[] = [];
      for (let i = 0; i < MAX_CARDS; i++) {
        initData.push({
          order: i + 1,
          name: "",
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
    if (!command) {
      return;
    }

    let [strOrder, strAmount, strSide, strName] = command.split(":");
    const order = parseInt(strOrder);
    const amount = parseInt(strAmount);
    const name = strName ? strName.trim() : undefined;
    const amounts = data[order - 1]?.amounts || [];

    strSide = strSide?.toUpperCase();

    const amountType =
      strSide === "D" || strSide === "X" ? AmountType.Bet : AmountType.Normal;

    let side: SideType;
    if (strSide === "D") {
      side = SideType.Red;
    }

    if (strSide === "X") {
      side = SideType.Green;
    }

    if (!order || order <= 0 || order > MAX_CARDS || !amount) {
      alert("Đã xảy ra lỗi, vui lòng thử lại");
      setCommand("");
      return;
    }

    const newData: ICard[] = [];

    data.forEach((card) => {
      if (card.order !== order) {
        newData.push(card);
      } else {
        const newAmount: IAmount = {
          type: amountType,
          value: amount,
          side,
        };

        const newCard = {
          name: name ? name : card.name,
          order,
          amounts: [newAmount].concat(amounts),
        };
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

  const handleVictory = (side: SideType) => {
    const confirmed = confirm("Bạn đã chắc chắn chưa?");

    if (!confirmed) {
      return;
    }

    const newData: ICard[] = [];

    data.forEach((card) => {
      const amount = card.amounts?.[0];

      if (amount?.type !== AmountType.Bet) {
        newData.push(card);
        return;
      }

      const value =
        amount?.side === side ? -1 * amount.value * 0.9 : amount.value;

      const newAmount: IAmount = {
        type: AmountType.Normal,
        value,
      };

      const newCard = {
        ...card,
        amounts: [newAmount].concat(card.amounts),
      };
      newData.push(newCard);
    });

    localStorage.setItem("data", JSON.stringify(newData));
    setData(newData);
  };

  return (
    <div className="flex flex-col w-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
      <div className="fixed flex items-center flex-shrink-0 w-full h-16 px-2 bg-white bg-opacity-75 overflow-x-scroll">
        <input
          className="h-10 w-24 px-4 text-sm bg-gray-200 rounded-lg focus:outline-none focus:ring"
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
          className="ml-3 bg-red-400 px-2 py-1 border rounded-md"
          onClick={() => handleVictory(SideType.Red)}
        >
          Đỏ
        </button>

        <button
          type="button"
          className="ml-3 bg-green-400 px-2 py-1 border rounded-md"
          onClick={() => handleVictory(SideType.Green)}
        >
          Xanh
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
        {data.map((card) => (
          <Card key={card.order} {...card} />
        ))}
      </div>
    </div>
  );
}

const Card = ({
  amounts,
  order,
  name,
}: {
  amounts: IAmount[];
  order: number;
  name: string;
}) => {
  return (
    <div
      className="card flex flex-col flex-shrink-0 w-14 py-20 mx-2"
      id={`card-${order}`}
    >
      <span className="block text-sm font-semibold">{name}</span>
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
              if (amount?.type === AmountType.Bet) {
                return (
                  <div className="text-gray-500" key={index}>
                    {amount?.value}

                    <span
                      className={classNames({
                        "text-red-500": amount?.side === SideType.Red,
                        "text-green-500": amount?.side === SideType.Green,
                      })}
                    >
                      {amount?.side !== undefined && SideText[amount?.side]}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  className={classNames({
                    "text-green-500": amount?.value > 0,
                    "text-red-500": amount?.value < 0,
                  })}
                  key={index}
                >
                  {amount?.value}
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

const SummaryAmount = ({ amounts }: { amounts: IAmount[] }) => {
  const sumAmount: number = amounts.reduce((acc: number, curr: IAmount) => {
    if (curr.type === AmountType.Bet) {
      return acc;
    }

    return (curr?.value || 0) + acc;
  }, 0);
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

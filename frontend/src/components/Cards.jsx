import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import Card from "./Card";

const Cards = () => {
  const {
    data: { transactions = [] } = {},
    loading,
    error,
  } = useQuery(GET_TRANSACTIONS);
  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;
  console.log(transactions);
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              profilePicture={transaction.user.profilePicture}
            />
          ))}
        {!loading && transactions.length == 0 && (
          <p className="text-5xl font-bold text-center my-10">
            No Transactions
          </p>
        )}
        {/* <Card cardType={"saving"} />
        <Card cardType={"expense"} />
        <Card cardType={"investment"} /> */}
        {/* <Card cardType={"investment"} />
        <Card cardType={"saving"} />
        <Card cardType={"expense"} /> */}
      </div>
    </div>
  );
};
export default Cards;

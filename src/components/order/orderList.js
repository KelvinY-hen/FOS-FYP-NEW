import { useState, useEffect } from "react";
import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { DataStore } from "aws-amplify";
import { Order, OrderStatus, Type } from "../../models";
import { useCTX } from "../../context/Context";
import { MotionConfig } from "framer-motion";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const { restaurant } = useCTX();
  const today = new Date();
  const [todayTotal, setTodayTotal] = useState({ number: 0, revenue: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    if (!restaurant) {
      return;
    }
    DataStore.query(Order, (order) =>
      order.and((o) => [
        o.restaurantID.eq(restaurant.id),
        o.or((orderStatus) => [
          orderStatus.status.eq("RECEIVED"),
          orderStatus.status.eq("ACCEPTED"),
          orderStatus.status.eq("REJECTED"),
          orderStatus.status.eq("READY_FOR_PICKEDUP"),
          orderStatus.status.eq("COMPLETED"),
          orderStatus.status.eq("CANCELLED"),
        ]),
      ])
    ).then(setOrders);
  }, [restaurant]);

  // useEffect(() => {
  //   const subscription = DataStore.observe(Order).subscribe((msg) => {
  //     const { opType, element } = msg;
  //     if (opType === "INSERT" && element.orderRestaurantId === restaurant.id) {
  //       setOrders((existingOrders) => [element, ...existingOrders]);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  useEffect(() => {
    if (orders) {
      let number = 0;
      let revenue = 0;

      orders.forEach((o) => {
        const tempDate = new Date(o.DateTime).toLocaleDateString();
        const todayDate = new Date().toLocaleDateString();
        const status = o.status
        console.log(status)

        if (tempDate === todayDate && o.status != OrderStatus.REJECTED && o.status != OrderStatus.CANCELLED) {
          number += 1;
          revenue += o.totalPrice;
        }
      });

      setTodayTotal({ number: number, revenue: revenue });
    }
  }, [orders]);

  const renderOrderStatus = (orderStatus) => {
    const statusToColor = {
      [OrderStatus.RECEIVED]: "green",
      [OrderStatus.CANCELLED]: "pink",
      [OrderStatus.ACCEPTED]: "orange",
      [OrderStatus.REJECTED]: "red",
      [OrderStatus.READY_FOR_PICKEDUP]: "yellow",
      [OrderStatus.COMPLETED]: "purple",
    };

    return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>;
  };

  const renderType = (type) => {
    const statusToColor = {
      [Type.DINEIN]: "green",
      [Type.PICKUP]: "blue",
    };

    return <Tag color={statusToColor[type]}>{type}</Tag>;
  };

  const tableColumns = [
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      render: renderType,
      filters: [
        {
          text: "DINE IN",
          value: "DINEIN",
        },
        {
          text: "PICK UP",
          value: "PICKUP",
        },
      ],
      onFilter: (value, record) => record.Type.indexOf(value) === 0,
    },
    {
      title: "Table Number",
      dataIndex: "table",
      key: "table",
    },
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dt) => new Date(dt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Ordered for",
      dataIndex: "DateTime",
      key: "DateTime",
      render: (dt) => new Date(dt).toLocaleString(),
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toFixed(2)} $`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderOrderStatus,
      filters: [
        {
          text: "RECEIVED",
          value: "RECEIVED",
        },
        {
          text: "ACCEPTED",
          value: "ACCEPTED",
        },
        {
          text: "REJECTED",
          value: "REJECTED",
        },
        {
          text: "READY_FOR_PICKEDUP",
          value: "READY_FOR_PICKEDUP",
        },
        {
          text: "COMPLETED",
          value: "COMPLETED",
        },
        {
          text: "CANCELLED",
          value: "CANCELLED",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 15 }}
      className="w-full min-h-screen"
    >
      <Card title={"Restaurant Order  "} style={{ margin: 20 }}>
        <div className="flex  w-full  items-center justify-center gap-10 pb-4">
          <div className=" bg-orange-400 min-w-[94px] drop-shadow-xl text-center rounded-2xl text-white p-7">
            Total Order for Today 
            <br/>
            <br/>
            <h3 className="text-5xl text-teal-300 ">{todayTotal.number}</h3>
          </div>
          <div className="bg-orange-400 min-w-[94px] drop-shadow-xl text-white text-center rounded-2xl p-7">
            Total Revenue for Today
            <br/>
            <br/>
            <h3 className="text-5xl text-teal-300">$ {todayTotal.revenue}</h3>
          </div>
        </div>
        <Table
          dataSource={orders}
          columns={tableColumns}
          rowKey="id"
          onRow={(orderItem) => ({
            onClick: () => navigate(`${orderItem.id}`),
          })}
        />
      </Card>
    </motion.div>
  );
};

export default OrdersList;

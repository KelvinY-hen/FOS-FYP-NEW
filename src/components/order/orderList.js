import { useState, useEffect } from "react";
import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { DataStore } from "aws-amplify";
import { Order, OrderStatus } from "../../models";
import { useCTX } from "../../context/Context";
import { MotionConfig } from "framer-motion";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const { restaurant } = useCTX();

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
        ]),
      ])
    ).then(setOrders);
  }, [restaurant]);

  useEffect(() => {
    const subscription = DataStore.observe(Order).subscribe((msg) => {
      const { opType, element } = msg;
      if (opType === "INSERT" && element.orderRestaurantId === restaurant.id) {
        setOrders((existingOrders) => [element, ...existingOrders]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderOrderStatus = (orderStatus) => {
    const statusToColor = {
      [OrderStatus.RECEIVED]: "green",
      [OrderStatus.ACCEPTED]: "orange",
      [OrderStatus.REJECTED]: "red",
      [OrderStatus.READY_FOR_PICKEDUP]: "yellow",
      [OrderStatus.COMPLETED]: "purple",
    };

    return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>;
  };

  const tableColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
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

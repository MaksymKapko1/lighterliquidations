import { useLiquidations } from "../hooks/useLiquidations";
import { InfoCard } from "../Components/InfoCard";
import { Table, Col, Row } from "antd";

export const HYPELiquidations = (data = []) => {
  const { liquidations, stats, status } = useLiquidations();
  const safeData = Array.isArray(data) ? data : [];

  const columns = [
    {
      title: "Coin",
      dataIndex: "coin",
      key: "coin",
    },
    {
      title: "Amount",
      dataIndex: "usd_amount",
      key: "amount",
    },
    {
      title: "Hash",
      dataIndex: "tx_hash",
      key: "hash",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
  ];
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <InfoCard
            title={"Liquidations for 24h."}
            value={stats.vol_24h}
          ></InfoCard>
        </Col>
        <Col span={8}>
          <InfoCard
            title={"The biggest liquidation."}
            value={stats.max_rekt}
          ></InfoCard>
        </Col>
        <Col span={8}>
          <InfoCard title={"OI(Open Interest)."}></InfoCard>
        </Col>
      </Row>
      <Table
        dataSource={liquidations.HYPE}
        columns={columns}
        style={{
          border: "1px solid #000000ff",
          borderRadius: "20px",
          padding: "10px",
          marginTop: "10px",
        }}
      />
    </div>
  );
};

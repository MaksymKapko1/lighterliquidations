import { Card, Col, Row } from "antd";
import { LinkOutlined, FireOutlined } from "@ant-design/icons";
import {
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import styles from "./SpotCard.module.css";

export const SpotCard = ({
  symbol,
  dailyUsdVolume,
  price,
  dailyHigh,
  dailyLow,
}) => {
  return (
    <Card
      className={styles.card}
      title={<div className={styles.cardContent}>{symbol}</div>}
    >
      <div className={styles.priceBlock}>
        <div style={{ textAlign: "left" }}>
          {" "}
          <div className={styles.label}>Price: </div>
          <div className={styles.priceValue}>{price}</div>
        </div>

        <div className={styles.statsPanel}>
          <Row gutter={[16, 16]}>
            <Col span={24} className={styles.volumeRow}>
              <div className={styles.flexBetween}>
                <span className={styles.iconLabel}>
                  <BarChartOutlined /> 24h Vol
                </span>
                <span className={styles.monoText}>{dailyUsdVolume}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.smallLabel}>
                <ArrowUpOutlined style={{ color: "#3fb950" }} /> 24h High
              </div>
              <div className={styles.monoTextWhite}>{dailyHigh}</div>
            </Col>
            <Col span={12} className={styles.textRight}>
              <div className={styles.smallLabel}>
                <ArrowDownOutlined style={{ color: "#f85149" }} /> 24h Low
              </div>
              <div className={styles.monoTextWhite}>{dailyLow}</div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};

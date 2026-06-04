import { FilterOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Grid,
  Space,
  Spin
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import ReportTabs from "../components/report/ReportTabs";
import { GET_REPORTS } from "../services/reportService";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

export default function ReportPage() {
  const screens = useBreakpoint();

  // default last 7 days
  const defaultRange = [
    dayjs().subtract(7, "day"),
    dayjs()
  ];

  const [selectedRange, setSelectedRange] = useState(defaultRange);

  const { data, loading, error, refetch } = useQuery(GET_REPORTS, {
    variables: {
      from: defaultRange[0].format("YYYY-MM-DD"),
      to: defaultRange[1].format("YYYY-MM-DD")
    },
    notifyOnNetworkStatusChange: true
  });

  const handleDateChange = (dates) => {
    setSelectedRange(dates);
  };

  const handleApply = () => {
    if (
      !selectedRange ||
      !selectedRange[0] ||
      !selectedRange[1]
    ) {
      refetch({
        from: null,
        to: null
      });
      return;
    }

    refetch({
      from: selectedRange[0].format("YYYY-MM-DD"),
      to: selectedRange[1].format("YYYY-MM-DD")
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Failed to load reports"
        description={error.message}
        style={{ margin: 24 }}
      />
    );
  }

  const reports = data?.reports || [];

  return (
    <div>
      <Space
        direction={screens.xs ? "vertical" : "horizontal"}
        align={screens.xs ? "stretch" : "center"}
        style={{
          width: "100%",
          marginBottom: 24
        }}
      >
        {screens.xs ? (
          <Space
            direction="vertical"
            style={{ width: "100%" }}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Start date"
              value={selectedRange?.[0]}
              onChange={(date) => {
                setSelectedRange([
                  date,
                  selectedRange?.[1]
                ]);
              }}
            />

            <DatePicker
              style={{ width: "100%" }}
              placeholder="End date"
              value={selectedRange?.[1]}
              onChange={(date) => {
                setSelectedRange([
                  selectedRange?.[0],
                  date
                ]);
              }}
            />
          </Space>
        ) : (
          <RangePicker
            value={selectedRange}
            onChange={handleDateChange}
            allowClear={false}
          />
        )}

        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={handleApply}
          block={screens.xs}
        >
          Apply
        </Button>
      </Space>

      <Card>
        <ReportTabs reports={reports} />
      </Card>
    </div>
  );
}
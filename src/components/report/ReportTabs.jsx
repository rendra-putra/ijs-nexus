import { useMutation } from "@apollo/client/react";
import { Tabs, message } from "antd";
import { useState } from "react";

import { CLOSE_REPORT, DELETE_REPORTS, GET_REPORTS } from "../../services/reportService";

import ReportDetailDrawer from "./ReportDetailDrawer";
import ReportTabOpen from "./ReportTabOpen";
import ReportTabResolved from "./ReportTabResolved";

export default function ReportTabs({ reports }) {

  const [selectedReport, setSelectedReport] = useState(null);

  /*
  ======================
  RESOLVE REPORT
  ======================
  */
  const [closeReport, { loading: resolveLoading }] = useMutation(CLOSE_REPORT, {
    refetchQueries: [{ query: GET_REPORTS }],
    awaitRefetchQueries: true,
    onCompleted: () => message.success("Report resolved"),
    onError: () => message.error("Failed to resolve report")
  });

  /*
  ======================
  BULK DELETE REPORTS
  ======================
  */
  const [deleteReports, { loading: deleteLoading }] = useMutation(
    DELETE_REPORTS,
    {
      update(cache, { variables }) {
        cache.modify({
          fields: {
            reports(existingReports = [], { readField }) {
              return existingReports.filter(
                (reportRef) =>
                  !variables.ids.includes(readField("id", reportRef))
              );
            }
          }
        });
      },
      onCompleted: (data) => {
        message.success(`${data.deleteReports} reports deleted`);
      },
      onError: () => {
        message.error("Failed to delete reports");
      }
    }
  );

  /*
  ======================
  HANDLERS
  ======================
  */

  const handleResolve = async (id) => {
    await closeReport({ variables: { id } });
    setSelectedReport(null);
  };

  const handleBulkDelete = async (ids) => {
    if (!ids.length) return;

    await deleteReports({
      variables: { ids },
      update(cache) {
        cache.modify({
          fields: {
            reports(existingReports = [], { readField }) {
              return existingReports.filter(
                (reportRef) => !ids.includes(readField("id", reportRef))
              );
            }
          }
        });
      }
    });
  };

  /*
  ======================
  FILTER REPORTS
  ======================
  */

  const openReports = reports.filter((r) => r.status === "open");
  const resolvedReports = reports.filter((r) => r.status === "resolved");

  /*
  ======================
  UI
  ======================
  */

  return (
    <>
      <Tabs
        items={[
          {
            key: "open",
            label: `Open (${openReports.length})`,
            children: (
              <ReportTabOpen
                reports={openReports}
                onView={setSelectedReport}
                onResolve={handleResolve}
                loading={resolveLoading}
              />
            )
          },
          {
            key: "resolved",
            label: `Resolved (${resolvedReports.length})`,
            children: (
              <ReportTabResolved
                reports={resolvedReports}
                onView={setSelectedReport}
                onBulkDelete={handleBulkDelete}
                loading={deleteLoading}
              />
            )
          }
        ]}
      />

      <ReportDetailDrawer
        report={selectedReport}
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onResolve={handleResolve}
        loading={resolveLoading}
      />
    </>
  );
}
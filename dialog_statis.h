 #ifndef DIALOG_STATIS_H
#define DIALOG_STATIS_H

#include <QDialog>
#include <QSqlDatabase>
#include <QSqlError>
#include <QSqlQuery>
#include <QtCharts/QChartView>
#include <QtCharts/QBarSeries>
#include <QtCharts/QBarSet>
#include <QtCharts/QLegend>
#include <QtCharts/QBarCategoryAxis>
#include <QtCharts/QHorizontalStackedBarSeries>
#include <QtCharts/QLineSeries>
#include <QtCharts/QCategoryAxis>
#include <QtCharts/QPieSeries>
#include <QtCharts/QPieSlice>
#include <QApplication>
#include <QMessageBox>
QT_CHARTS_USE_NAMESPACE
namespace Ui {
class Dialog_statis;
}

class Dialog_statis : public QDialog
{
    Q_OBJECT

public:
    explicit Dialog_statis(QWidget *parent = nullptr);
    ~Dialog_statis();
   QChartView *chartView ;
    void choix_bar();
    void choix_pie();

private:
    Ui::Dialog_statis *ui;
};

#endif // DIALOG_STATIS_H


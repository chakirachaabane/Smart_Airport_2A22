#ifndef STATISTIQUE_H
#define STATISTIQUE_H
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
#include "mainwindow.h"
#include "ui_mainwindow.h"


QT_CHARTS_USE_NAMESPACE

namespace Ui
{
class  dialog_stat;
}
class  dialog_stat : public QDialog
{
    Q_OBJECT

public:
    explicit  dialog_stat(QWidget *parent = nullptr);
    ~ dialog_stat();

    QChartView *chartView;
    void choix_bar();
    void choix_pie();

private:
    Ui::dialog_stat *ui;
};


#endif // STATISTIQUE_H

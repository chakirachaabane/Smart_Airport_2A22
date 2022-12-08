 #include "dialog_statis.h"
#include "ui_dialog_statis.h"
#include "mainwindow.h"
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

#include"QChartView"
QT_CHARTS_USE_NAMESPACE

Dialog_statis::Dialog_statis(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog_statis)
{
    ui->setupUi(this);
}

//bar chart
void Dialog_statis::choix_bar()
{
QSqlQuery q1,q2,q3,q4;
qreal tot=0,c1=0,c2=0,c3=0;

q1.prepare("SELECT * VOYAGEURS");
q1.exec();

q2.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='10'");
q2.exec();

q3.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='20'");
q3.exec();

q4.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='30' ");
q4.exec();



while (q1.next()){tot++;}
while (q2.next()){c1++;}
while (q3.next()){c2++;}
while (q4.next()){c3++;}

c1=c1/tot;
c2=c2/tot;
c3=c3/tot;


// Assign names to the set of bars used
        QBarSet *set0 =new QBarSet("10");
        QBarSet *set1 = new QBarSet("20");
        QBarSet *set2 = new QBarSet("30");

        // Assign values for each bar
        *set0 << c1;
        *set1 << c2;
        *set2 << c3;



        // Add all sets of data to the chart as a whole
        // 1. Bar Chart
        QBarSeries *series = new QBarSeries();

        // 2. Stacked bar chart
        series->append(set0);
        series->append(set1);
        series->append(set2);


        // Used to define the bar chart to display, title
        // legend,
        QChart *chart = new QChart();

        // Add the chart
        chart->addSeries(series);


        // Adds categories to the axes
       // QBarCategoryAxis *axis = new QBarCategoryAxis();



        // 1. Bar chart
       // chart->setAxisX(axis, series);

        // Used to change the palette
        QPalette pal = qApp->palette();

        // Change the color around the chart widget and text
        pal.setColor(QPalette::Window, QRgb(0xffffff));
        pal.setColor(QPalette::WindowText, QRgb(0x404044));

        // Apply palette changes to the application
        qApp->setPalette(pal);


// Used to display the chart
chartView = new QChartView(chart,ui->label);
chartView->setRenderHint(QPainter::Antialiasing);
chartView->setMinimumSize(400,400);

chartView->show();
}

//pie chart
    void Dialog_statis::choix_pie()
    {
    QSqlQuery q1,q2,q3,q4;
    qreal tot=0,c1=0,c2=0,c3=0;

    q1.prepare("SELECT * FROM VOYAGEURS");
    q1.exec();

    q2.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='10'");
    q2.exec();

    q3.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='20'");
    q3.exec();

    q4.prepare("SELECT * FROM VOYAGEURS WHERE AGE_VOY='30' ");
    q4.exec();

    while (q1.next()){tot++;}
    while (q2.next()){c1++;}
    while (q3.next()){c2++;}
    while (q4.next()){c3++;}

    c1=c1/tot;
    c2=c2/tot;
    c3=c3/tot;

    // Define slices and percentage of whole they take up
    QPieSeries *series = new QPieSeries();
    series->append("10",c1);
    series->append("20",c2);
    series->append("30",c3);




    // Create the chart widget
    QChart *chart = new QChart();

    // Add data to chart with title and show legend
    chart->addSeries(series);
    chart->legend()->show();


    // Used to display the chart
    chartView = new QChartView(chart,ui->label);
    chartView->setRenderHint(QPainter::Antialiasing);
    chartView->setMinimumSize(400,400);

    chartView->show();
    }

Dialog_statis::~Dialog_statis()
{
    delete ui;
}



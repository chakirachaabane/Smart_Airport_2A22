#include "stats_age.h"
#include "ui_stats_age.h"

stats_age::stats_age(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::stats_age)
{
    ui->setupUi(this);
}

stats_age::~stats_age()
{
    delete ui;
}

void stats_age::stats()
{

    QSqlQuery q1,q2,q3,q4;
    qreal tot=0,c1=0,c2=0,c3=0;

    q1.prepare("SELECT * FROM employes");
    q1.exec();

    q2.prepare("SELECT * FROM employes WHERE age_emp>=25 and age_emp<=34");
    q2.exec();

    q3.prepare("SELECT * FROM employes WHERE age_emp>=35 and age_emp<=45");
    q3.exec();

    q4.prepare("SELECT * FROM employes WHERE age_emp>=45 ");
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
    series->append("25-34",c1);
    series->append("35-45",c2);
    series->append("45-",c3);




    // Create the chart widget
    QChart *chart = new QChart();

    // Add data to chart with title and show legend
    chart->addSeries(series);
    chart->legend()->show();


    // Used to display the chart
    chartView = new QChartView(chart,ui->label_stat);
    chartView->setRenderHint(QPainter::Antialiasing);
    chartView->setMinimumSize(621,471);

    chartView->show();


}

#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include "vols.h"
#include "arduino.h"
#include "parking.h"
#include <QMainWindow>



#include <QSortFilterProxyModel>
#include <QTextTableFormat>
#include <QStandardItemModel>
#include <QDialog>
#include <QFileDialog>
#include <QDialog>
#include <QDesktopWidget>
#include <QSettings>
#include <QPrinter>

#include <QTextStream>
#include <QFile>
#include <QDataStream>
#include <QTextDocument>




#include <QtCharts/QBarSeries>
#include <QtCharts/QBarSet>
#include <QtCharts/QLegend>
#include <QtCharts>
#include <QtCharts/QPieSeries>
#include <QtCharts/QPieSlice>
#include <QPieSlice>
#include <QPieSeries>
#include <QtCharts/QChartView>
#include <QApplication>

#include <QCalendarWidget>
#include <QDateEdit>
#include <QDateTime>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pushButton_clicked();
   // void update_label();
    void on_pushButton_supprimer_clicked();

    void on_pushButton_3_clicked();

    void on_comboBox_modif_currentIndexChanged(const QString &arg1);

    void on_comboBox_supp_currentIndexChanged(const QString &arg1);

    void on_pushButton_5_clicked();

    void on_pushButton_trie_clicked();

    void on_pushButton_stat_clicked();

    void on_pushButton_pdf_clicked();

    void on_calendarWidget_clicked(const QDate &date);

    void on_pushButton_excel_clicked();

private:
    Ui::MainWindow *ui;
   Vols V;
    //  parking pk;
   QByteArray data; // variable contenant les données reçues

      arduino A; // objet temporaire
};
#endif // MAINWINDOW_H

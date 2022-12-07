#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>


#include <QSortFilterProxyModel>
#include <QTextTableFormat>
#include <QTextDocument>
#include <QStandardItemModel>
#include <QDialog>
#include <QFileDialog>
#include <QDesktopWidget>
#include <QSettings>
#include <QPrinter>
#include <QTextStream>
#include <QFile>
#include <QDataStream>
#include "employee.h"
#include "stats_age.h"
#include "arduino.h"

 // //////////////////////////////////////////CHAKIRA////////////////////////////////////////////////////////////////////////////////////////

#include "vols.h"
#include "parking.h"

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
// /////////////////////////////////////////////

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    bool controlesaisi();


private slots:
    void on_login_clicked();

    void on_pushButton_ajouter_clicked();

    void on_supprimer_emp_clicked();

    void on_modifier_e_clicked();

    void on_trier_bt_clicked();

    void on_chercher_bt_clicked();

    void on_pushButton_statistique_clicked();

    void on_pushButton_2_clicked();
    void onMsg();



    void on_mdp_oubliee_bt_clicked();

    void on_sign_in_clicked();

    void on_quitter_button_clicked();

  // //////////////////////////////////////////CHAKIRA////////////////////////////////////////////////////////////////////////////////////////
    void on_pushButton_clicked();
   void update_label();
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
 // ////////////////////////////////////////////////////////////////////////////////////////////////////
    void on_services_bt_clicked();

private:
    Ui::MainWindow *ui;
    int selected=0;
    QStringList files;
    Employee e;
    stats_age *s;

    //arduino
    QByteArray data;
    Arduino A;
 //chaki
    Vols V;
       parking pk;
 //chaki
};
#endif // MAINWINDOW_H

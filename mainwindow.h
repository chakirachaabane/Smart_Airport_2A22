#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include"station.h"
#include <QSortFilterProxyModel>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
      QSortFilterProxyModel *proxy;

private slots:

    void on_pb_ajouter_clicked();

    void on_PB_supp_clicked();

    void on_PB_Modif_clicked();

    //void on_triid_clicked();

    void on_pushButton_triid_clicked();

    void on_tri_numdeposte_clicked();

    //void on_recherche_3_cursorPositionChanged(int arg1, int arg2);

   // void on_cherche_cursorPositionChanged(int arg1, int arg2);

    //void on_rechercherr_cursorPositionChanged(int arg1, int arg2);

    void on_rechercherr_clicked();

    void on_pushButton_plus_s1_clicked();

    void on_pushButton_plus_s2_clicked();

    void on_pushButton_plus_s3_clicked();

    void on_pushButton_plus_s4_clicked();

    void on_pushButton_plus_s5_clicked();

    void on_pushButton_plus_s6_clicked();

private:
    Ui::MainWindow *ui;
    Station s;
};

#endif // MAINWINDOW_H

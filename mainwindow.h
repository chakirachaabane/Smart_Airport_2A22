#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include"station.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:

    void on_pb_ajouter_clicked();

    void on_PB_supp_clicked();



    void on_PB_Modif_clicked();

private:
    Ui::MainWindow *ui;
    Station s;
};

#endif // MAINWINDOW_H

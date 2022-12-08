#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include "voyageur.h"
#include <QMainWindow>
#include <QDebug>
#include<QMessageBox>
#include"voyageur.h"
#include<QString>
#include "dialog_statis.h"
#include "ui_dialog_statis.h"
QT_BEGIN_NAMESPACE
namespace Ui {class MainWindow;}
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pb_ajouter_clicked();

    void on_pb_supprimer_clicked();

    void on_pb_modifier_clicked();

    void on_pb_rechercher_clicked();

    void on_pb_tri_nom_clicked();

    void on_pb_tri_prenom_clicked();

    void on_pb_tri_cin_clicked();

    void on_pb_PDF_clicked();

    void on_ajoutHis_clicked();

   //void on_pb_statistique_clicked();

    void on_pb_voyageufidel_clicked();

   // void on_pb_voyfidele_clicked();

private:
    Ui::MainWindow *ui;
    Voyageur V;
};

#endif // MAINWINDOW_H

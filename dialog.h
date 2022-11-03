#ifndef DIALOG_H
#define DIALOG_H
#include "vols.h"
#include <QDialog>


namespace Ui {
class Dialog;
}

class Dialog : public QDialog
{
    Q_OBJECT

public:
    explicit Dialog(QWidget *parent = nullptr);
    void setvols(Vols V);
    ~Dialog();

private:
    Ui::Dialog *ui;
};

#endif // DIALOG_H

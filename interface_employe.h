#ifndef INTERFACE_EMPLOYE_H
#define INTERFACE_EMPLOYE_H

#include <QDialog>

namespace Ui {
class interface_employe;
}

class interface_employe : public QDialog
{
    Q_OBJECT

public:
    explicit interface_employe(QWidget *parent = nullptr);
    ~interface_employe();

private:
    Ui::interface_employe *ui;
};

#endif // INTERFACE_EMPLOYE_H

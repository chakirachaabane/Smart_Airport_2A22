QT       += core gui sql charts printsupport axcontainer network multimedia multimediawidgets svg serialport

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    activatoncodeclass.cpp \
    arduino.cpp \
    connection.cpp \
    employee.cpp \
    main.cpp \
    mainwindow.cpp \
    recuperer_mdp.cpp \
    signupdialog.cpp \
    smtp.cpp \
    stats_age.cpp

HEADERS += \
    activatoncodeclass.h \
    arduino.h \
    connection.h \
    employee.h \
    mainwindow.h \
    recuperer_mdp.h \
    signupdialog.h \
    smtp.h \
    stats_age.h

FORMS += \
    activatoncodeclass.ui \
    mainwindow.ui \
    recuperer_mdp.ui \
    signupdialog.ui \
    stats_age.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    ../icon.qrc

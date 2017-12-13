# Exmo Monitoring

* Русскоязычная документация [здесь](https://github.com/8hp/exmo-monit/blob/master/README_RU.md)

* Информация о лицензии [здесь](https://github.com/8hp/exmo-monit/blob/master/LICENSE_RU)

---

[![EXMO bitcon Exchange](https://exmo.me/static/img/affiliate/affiliate4.png "EXMO bitcon Exchange")](https://exmo.me/?ref=168135)

---

## Description

Every self-respecting trader always keeps pace with the times and develops not only 
trade and analysis skills, but also automation of the process. We are ready to 
provide everyone with an absolutely free tool for "Monitoring". 

This functionality will be useful if the trader is away from his computer and 
it is very important for him to receive up-to-date information about the account. 

In our case, we report to investors, adding them to the newsletter!

The main task of the bot is collecting information about the account and sending the report by mail.

---

## Functional

* Collects information online (balance, reserves);

* Automatically counts the current balance and displays the total amount;

* Sends the report by mail (one or several addressees);

* Start the dispatch on a specific time (scheduler).

---

## Installation

Clone script from the repository

```bash
git clone https://github.com/8hp/exmo-monit
```

Run the installation of dependent packages on the command line

```bash
npm install
```

Install `pm2` for autostart

```bash
npm install pm2 -g
```

---

## Configurations

Open the text file `config.json` in the text editor and replace with your data, description of the fields below:

**debug** - on / off display of working information (useful for the developer);

    Available Values: true / false, false by default

> Important, if the value is `false`, the distribution is activated!

**currency** - the main currency for conversion in calculations;

    Available Values: USD / BTC, default USD

**exmo: key** - the public key of the Exmo API (can be found in [settings] (https://exmo.me/en/profile) of the account);

    Example: K-0343a803e21fa0103ccc2525ed7bfe8b3529d822

**exmo: secret** - private key API Exmo (can be found in [settings] (https://exmo.me/en/profile) account);

    Example: S-9c7b2dec19sac58a79349bc4c3e3886ad36ce0f1

**exmo: url** - the address, the requests for the Exmo API are sent;

**mail: server** - SMTP server, in this case Gmail;

> You can configure other services (such as Yandex, Mail.ru, etc.)

**mail: user** - login in Gmail;

**mail: password** - Gmail application password;

**mail: from** - name and address from whom the letter will come;

    Example: ExmoMonit <admin@gmail.com>

**mail: time** - time of dispatch by the principle (scheduler);

    Example: 0 * * * *

**mail: subscribers** - postal addresses to which the report will be sent;

    Example: "user1@gmail.com", "user2@gmail.com" ...

---

## Running

```bash
npm start
```

> After startup, the script will start monitoring `pm2 monit`

---

## Example letter

report 2017.12.07 \[06: 00 \]

balances:

| currency | volume | amount |
| ------------- | ------------- | ------------- |
| USD | 500 | 500 |

reserved:

| currency | volume | amount |
| ------------- | ------------- | ------------- |
| USDT | 22.1717347 | 23 |
| ETC | 16 | 409.12 |

total on # 162215: **932.12** USD

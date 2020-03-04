import os

CRONJOBS = [
    ('* * * * *', 'books.cron.send_notification.send_borrows_out_of_time_notifications')
]

CRON_EMAIL_NOTIFICATION_SETTINGS = {
    'TEMPLATE_FROM': os.environ.get('DJANGO_EMAIL_CRON_FROM', 'notifications@kamu.com'),
    'TEMPLATE_SUBJECT': 'Kamu friendly reminder',
    'TEMPLATE_BODY':  '''
        Hi!,

        We noticed you still have the book <b>{bookName}</b> borrowed in <b>{borrowedDate}</b>.

        This is only a friendly reminder to return the book to the library.

        If you are still reading the book, please ignore this message,

        but consider that other people might be waiting for you to return it.

        Greetings from Kamu team.

        <i>Autogenerated email, please do not reply</i>
    ''',
    'BORROW_MAX_TERM_MONTH': 3
}


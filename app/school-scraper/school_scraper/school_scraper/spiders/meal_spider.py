import scrapy

from datetime import datetime

from scrapy import FormRequest, Request


class MealSpider(scrapy.Spider):
    name = "meal_spider"
    allowed_domains = ["systemcraftsman.github.io"]
    start_urls = ["https://systemcraftsman.github.io/scrapy-demo/website/index.html"]
    welcome_page_url = "https://systemcraftsman.github.io/scrapy-demo/website/welcome.html"
    meal_page_url = "https://systemcraftsman.github.io/scrapy-demo/website/meal-list.html"
    date_str = "12.03.2024"

    def parse(self, response):
        formdata = {'username': 'student',
                    'password': '12345'}
        return FormRequest(url=self.welcome_page_url, method="GET", formdata=formdata,
                           callback=self.after_login)

    def after_login(self, response):
        if response.status == 200:
            return Request(url=self.meal_page_url,
                           callback=self.parse_meal_page
                           )

    def parse_meal_page(self, response):
        if response.status == 200:
            data = {"BREAKFAST": "", "LUNCH": "", "SALAD/DESSERT": "", "FRUIT TIME": ""}
            week_no = datetime.strptime(self.date_str, '%d.%m.%Y').isoweekday()
            rows = response.xpath('//*[@class="table table-condensed table-yemek-listesi"]//tr')
            key = ""
            try:
                for row in rows[1:]:
                    if self._get_item(row, week_no) in data.keys():
                        key = self._get_item(row, week_no)
                    else:
                        data[key] = self._get_item(row, week_no, "\n")
            finally:
                return data

    def _get_item(self, row, col_number, seperator=""):
        item_str = ""
        contents = row.xpath(f'td[{col_number}]//text()').extract()
        for i, content in enumerate(contents):
            item_str = item_str + content + seperator
        return item_str

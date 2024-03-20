import scrapy

from scrapy import FormRequest, Request


class HomeworkSpider(scrapy.Spider):
    name = "homework_spider"
    allowed_domains = ["systemcraftsman.github.io"]
    start_urls = ["https://systemcraftsman.github.io/scrapy-demo/website/index.html"]
    welcome_page_url = "https://systemcraftsman.github.io/scrapy-demo/website/welcome.html"
    homework_page_url = "https://systemcraftsman.github.io/scrapy-demo/website/homeworks.html"
    date_str = "12.03.2024"

    def parse(self, response):
        formdata = {'username': 'student',
                    'password': '12345'}
        return FormRequest(url=self.welcome_page_url, method="GET", formdata=formdata,
                           callback=self.after_login)

    def after_login(self, response):
        if response.status == 200:
            return Request(url=self.homework_page_url,
                           callback=self.parse_homework_page
                           )

    def parse_homework_page(self, response):
        if response.status == 200:
            data = {}
            rows = response.xpath('//*[@class="table table-file"]//tbody//tr')
            for row in rows:
                if self._get_item(row, 4) == self.date_str:
                    if self._get_item(row, 2) not in data:
                        data[self._get_item(row, 2)] = self._get_item(row, 3)
                    else:
                        data[self._get_item(row, 2) + "-2"] = self._get_item(row, 3)
            return data

    def _get_item(self, row, col_number):
        item_str = ""
        contents = row.xpath(f'td[{col_number}]//text()').extract()
        for content in contents:
            item_str = item_str + content
        return item_str

#!/Users/mabulgu/github-repos/mabulgu/bilfen-reminder/venv/bin/python
import sys

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from school_scraper.school_scraper.spiders.homework_spider import HomeworkSpider
from school_scraper.school_scraper.spiders.meal_spider import MealSpider

results = []


class ResultsPipeline(object):
    def process_item(self, item, spider):
        results.append(item)


def _prepare_message(title, data_dict):
    if len(data_dict.items()) == 0:
        return None

    message = f"===={title}====\n----------------\n"
    for key, value in data_dict.items():
        message = message + f"==={key}===\n{value}\n----------------\n"

    return message


def main(args=None):
    if args is None:
        args = sys.argv
    settings = get_project_settings()
    settings.set("ITEM_PIPELINES", {'__main__.ResultsPipeline': 1})
    process = CrawlerProcess(settings)

    if args[1] == "homework":
        process.crawl(HomeworkSpider)
        process.start()
        print(_prepare_message("HOMEWORK ASSIGNMENTS", results[0]))
    elif args[1] == "meal":
        process.crawl(MealSpider)
        process.start()
        print(_prepare_message("MEAL LIST", results[0]))


if __name__ == "__main__":
    main()

import requests as rq
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
import time

######################## Crawl the url of shop page" ##########################
# url = "https://www.foodpanda.com.tw/restaurants/lat/22.9988416/lng/120.2195148/city/%E6%9D%B1%E5%8D%80/address/%25E5%259C%258B%25E7%25AB%258B%25E6%2588%2590%25E5%258A%259F%25E5%25A4%25A7%25E5%25AD%25B8%252C%2520701%25E5%258F%25B0%25E7%2581%25A3%25E5%258F%25B0%25E5%258D%2597%25E5%25B8%2582%25E6%259D%25B1%25E5%258D%2580%25E5%25A4%25A7%25E5%25AD%25B8%25E8%25B7%25AF1%25E8%2599%259F/%25E5%25A4%25A7%25E5%25AD%25B8%25E8%25B7%25AF/1%25E8%2599%259F%2520%25E5%259C%258B%25E7%25AB%258B%25E6%2588%2590%25E5%258A%259F%25E5%25A4%25A7%25E5%25AD%25B8?postcode=701&verticalTab=restaurants&expedition_type=pickup"
# browser = webdriver.Chrome()
# browser.get(url)
# time.sleep(1)
# elem = browser.find_element_by_tag_name("body")
# no_of_pagedowns = 30

# while no_of_pagedowns:
#     elem.send_keys(Keys.PAGE_DOWN)
#     elem.send_keys(Keys.PAGE_DOWN)
#     elem.send_keys(Keys.PAGE_DOWN)
#     no_of_pagedowns -= 1
#     print(no_of_pagedowns)
#     time.sleep(2)

# fin = open('./crawler_data/shopData.txt', "r")
# fout = open('./shopUrl.txt', "w")
# lines = fin.readlines()

# names = []
# i = 0
# while i < len(lines):
#     flag = False
#     try:
#         href = browser.find_element_by_xpath("//span[text()='" + lines[i].strip('\n') + "']/../../../..").get_attribute('href')
#         flag = True
#     except:
#         flag = False
#         pass

#     if flag:
#         print(href)
#         fout.write(href+'\n')

#     i += 10

# fin.close()
# fout.close()

######################## Crawl items of shop" ##########################
fin = open('./crawler_data/shopUrl.txt', "r")
fout = open('./itemData.txt', "w")
lines = fin.readlines()

browser = webdriver.Chrome()
for i in range(len(lines)):
    browser.get(lines[i].replace("/en/", "/"))
    time.sleep(1)
    try:
        shop = browser.find_element_by_class_name("fn").text
    except:
        continue
    print(shop)
    fout.write('shopName='+shop+'\n')
    for j in browser.find_elements_by_class_name("menu__item"):
        try:
            name = j.find_element_by_class_name("dish-name").text
        except:
            continue
        print(name)
        try:
            intro = j.find_element_by_class_name("dish-description").text
        except:
            intro = ''
        print(intro)
        try: 
            price = j.find_element_by_class_name("price").text.split('$')[1]
        except:
            continue
        print(price)
        try:
            img = j.find_element_by_class_name("photo").get_attribute("data-src")
        except:
            img = ""
        print(img)
        fout.write(name+'\n')
        fout.write(intro+'\n')
        fout.write(price+'\n')
        fout.write(img+'\n')

fin.close()
fout.close()
browser.close()

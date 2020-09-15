import requests as rq
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
import time

url = "https://www.foodpanda.com.tw/restaurants/lat/22.9988416/lng/120.2195148/city/%E6%9D%B1%E5%8D%80/address/%25E5%259C%258B%25E7%25AB%258B%25E6%2588%2590%25E5%258A%259F%25E5%25A4%25A7%25E5%25AD%25B8%252C%2520701%25E5%258F%25B0%25E7%2581%25A3%25E5%258F%25B0%25E5%258D%2597%25E5%25B8%2582%25E6%259D%25B1%25E5%258D%2580%25E5%25A4%25A7%25E5%25AD%25B8%25E8%25B7%25AF1%25E8%2599%259F/%25E5%25A4%25A7%25E5%25AD%25B8%25E8%25B7%25AF/1%25E8%2599%259F%2520%25E5%259C%258B%25E7%25AB%258B%25E6%2588%2590%25E5%258A%259F%25E5%25A4%25A7%25E5%25AD%25B8?postcode=701&verticalTab=restaurants&expedition_type=pickup"
f = open('shopData.txt', 'w')
browser = webdriver.Chrome()
browser.get(url)
time.sleep(1)
elem = browser.find_element_by_tag_name("body")
no_of_pagedowns = 50

while no_of_pagedowns:
    elem.send_keys(Keys.PAGE_DOWN)
    elem.send_keys(Keys.PAGE_DOWN)
    elem.send_keys(Keys.PAGE_DOWN)
    no_of_pagedowns -= 1
    time.sleep(2)

for i in browser.find_elements_by_class_name("vendor-list"):
    for j in i.find_elements_by_tag_name("a"):
        flag = False
        try:
            shop_page = j.get_attribute('href')
            response = rq.get(shop_page)
            soup = BeautifulSoup(response.text, 'html.parser')
            name = soup.find(class_="vendor-name").text
            starNum = soup.find(class_="rating").text.split('/')[0]
            priceNum = str(round(len(soup.findAll(class_="budget-symbol--filled"))/2))
            commentNum = soup.find(class_="count").text.strip()
            openTime = re.sub(' +', ' ', soup.find(class_="schedule-times").text.strip())
            addr = soup.find(class_="vendor-location").text.split(')')[1].strip().replace("\n", " ")
            img = soup.find(class_="vendor-picture")['data-src'].split('?')[0]
            tmp = soup.find(class_="vendor-cuisines").findAll("li")
            shopType = tmp[1].text
            tag = ''
            for k in range(1, len(tmp)):
                tag += ('# ' + tmp[k].text + ' ')
            isGroup = "0"
            if '店內價' in tag:
                isGroup = "1"
            print(name, starNum, priceNum, commentNum, openTime, addr, img, tag, isGroup, shopType)
            flag = True
        except:
            flag = False
            pass

        if(flag):
            f.write(name+'\n')
            f.write(starNum+'\n')
            f.write(priceNum+'\n')
            f.write(commentNum+'\n')
            f.write(openTime+'\n')
            f.write(addr+'\n')
            f.write(img+'\n')
            f.write(tag+'\n')
            f.write(shopType+'\n')
            f.write(isGroup+'\n')

f.close()
browser.close()

# response = rq.get(url)
# soup = BeautifulSoup(response.text, 'html.parser')
# count = 0

# for i in soup.findAll(class_='vendor-list'):
#     # for j in i.findAll(class_='name'):
#     print(i)
#     count += 1

# print(count)

import urllib2
import re
import sys
from bs4 import BeautifulSoup

class Spider():
    def __init__(self, user_agent):
        self.user_agent = user_agent

    def analyzeHtml(self, content):
        if content is None:
            print "Empty"
        print content
        bs = BeautifulSoup(content,"html.parser")
        title = bs.title
        author = bs.find_all("a",class_="author-link")
        if author is not None:
            for a in author:
                print a
                for a_name in a.strings:
                    print a_name
        answers = bs.find_all("div", class_="zm-editable-content clearfix")
        if answers is not None:
            for answer in answers:
                for answer_detail in answer.strings:
                    print answer_detail
        print answer

    def getContentFromHost(self, url):
        header = {"User-Agent": self.user_agent}
        request = urllib2.Request(url, headers=header)
        response = urllib2.urlopen(request)
        content = response.read()
        print sys.argv

    	fo = open(sys.argv[1] + '.html', 'w')
    	fo.write(content)
    	fo.close()
        return content


if __name__ == '__main__':
    host = "https://www.zhihu.com/question/" + sys.argv[1]
    user_agent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
    spider = Spider(user_agent)
    spider.analyzeHtml(spider.getContentFromHost(host))

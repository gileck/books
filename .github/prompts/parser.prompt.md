I want to parse a text of a book I copied from a PDF of a book.

The result should be a JSON of chapters to paragraphs.
The JSON should be saved to a file output.json in the same folder.

The result should be an object between a chapter name and the chapter content splitted to paragraphs (array of strings). 
the content of the chapter should not include the name or page number. just the content of the paragraphs of the chapter.

for example:
```
{
[SOME CHAPTER NAME]: [
    "paragraph 1...",
    "paragraph 2...",
],
[SOME OTHER CHAPTER NAME]: [
    "paragraph 1...",
    "paragraph 2...",
],
}
```


"""
The text is formatted this way:

[PAGE NUMBER] [CHAPTER NAME] OR [CHAPTER NUMBER] [PAGE NUMBER]
[PAGE CONTENT]
[ONE EMPTY LINE OR MORE]
[PAGE NUMBER] [CHAPTER NAME] OR [CHAPTER NUMBER] [PAGE NUMBER]
[PAGE CONTENT]
[ONE EMPTY LINE OR MORE]

"""
When a new chapter starts - it starts with chapter name number and chapter name one after another.
this is the format:
"
CHPATER [NUMBER]
[CHAPTER NAME]
"
-- for example:
"
CHAPTER 4
APPEARANCE
"
except the INTRODUCTION chapter that starts like this:
"1 INTRODUCTION"

"""

The [CHAPTER NAME] should be extracted to be the key of the result object.
"""

There are multiple pages per chapter so the chapter name and number will repeat it self for all its pages.
for example:

SOME CHAPTER 1
chapter content...
more chapter content...

2 CHAPTER 1
chapter content...
more chapter content...

OTHER CHAPTER 3
chapter content...
more chapter content...

4 CHAPTER 2
chapter content...
more chapter content...
"""
Pay attention that in the examples there are 2 chapters:
chapter 1: SOME CHAPTER
chapter 2: OTHER CHAPTER
each chapter have 2 pages. 
the first page starts with "SOME CHAPTER 1" - meaning [CHAPTER NAME] [PAGE NUMBER]
the second page starts with "2 CHAPTER 1" - meaning [PAGE NUMBER] [CHAPTER NUMBER]
"""
There is a special case for chapter 0: INTRODUCTION which is always refered to as INTRODUCTION and not chapter 0.

"""
In some cases the content is cut of into 2 lines and should be combined. for example:

"There is a word in the sent-
ence that is cut off"

the result should be: "There is a word in the sentence that is cut off."

pay attention that the "-" that is connection between sent and ence is removed since we combined the 2 parts of the word into one.

"""

In some cases the content of a page does not end in a sentence - it continue to the next page.
on those cases its important to connect the sentences to the same sentence. 
its easy to find those cases if a line ends without a line-ending charected (for example ".", ";", etc...)
the rest of the sentence will be found on the next page.

for example:

[PAGE 1]
this is a sentence that is cut in 
[PAGE 2]
the middle between 2 pages.

Its important to combine the sentence so the result will be: "this is a sentence that is cut in the middle between 2 pages."

"""
The book includes images. images are marked as "Image [Image Number].". 
the regex is /Image \d+\./ - notice the . on the end.
an image description is following the image marker.

For example: 
"Image 1. this is an image descriptoin."

Its important that images will have their own lines.
"""


Make sure that the page header - the chapter name and page number are extracted from the content and are not included in the content of the chapter (unless its inside a sentence and is part of the book which is OK).




After running the test, check output.json and verify it works as expected. if not fix and repeater.



Are the instructions clear enough or you want more information?


from bs4 import BeautifulSoup
from urllib.request import urlopen

class curs:
    def __init__(self, profil, limba, an, ziua, orele, frecventa, sala, formatia, tipul, disciplina, profesor):
        self.profil = profil
        self.limba = limba
        self.an = an
        self.ziua = ziua
        self.orele = orele
        self.frecventa = frecventa
        self.sala = sala
        self.formatia = formatia
        self.tipul = tipul
        self.disciplina = disciplina
        self.profesor = profesor

    def to_string(self):
        return str(self.profil + ',' + self.limba + ',' + str(self.an) + ',' + self.ziua + ',' + self.orele + ',' + self.frecventa + ',' + self.sala + ',' + self.formatia + ',' + self.tipul + ',' + self.disciplina + ',' + self.profesor + '\n')

    def __lt__(self, other):
        return self.profil < other.profil
    
default_link = 'http://www.cs.ubbcluj.ro/files/orar/2017-2/tabelar/'
main_raw_page = 'http://www.cs.ubbcluj.ro/files/orar/2017-2/tabelar/index.html'
main_page = urlopen(main_raw_page)
main_soup = BeautifulSoup(main_page, 'html.parser')
specializari = []
toate_orele = []

main_tables = main_soup.find_all('table')
main_rows = main_tables[0].find_all('tr')
for row in main_rows:
    cols = row.find_all('td')
    if (len(cols) > 0):
        prima_coloana = cols[0].text
        profil = prima_coloana.split("-",1)[0]#am facut rost de numele profilului
        limba = prima_coloana.split(" ")[-1]#si al limbii, ne mai trebuie adresa paginii pt a putea crea un triplet
        #cols[1],[2],[3] ar trebui sa aiba linkurile respective
        links = row.find_all('a')
        for link in links:
            an = link.text.split(" ")[-1]
            link_profil = default_link + link['href']
            specializari.append([profil.strip(), limba, an, link_profil])

f = open('test.txt', 'w')
for orare in specializari:
    raw_page = orare[3]
    page = urlopen(raw_page)
    soup = BeautifulSoup(page, 'html.parser')

    for row in soup.find_all('a'):
        row.replaceWithChildren()

    tables = soup.find_all('table')

    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            if (len(cols) > 0):
                ziua = cols[0].text
                orele = cols[1].text
                frecventa = ""
                if (len(cols[2].text) == 1):
                    frecventa = "saptamanal"
                else:
                    frecventa = cols[2].text
                sala = cols[3].text
                formatia = cols[4].text
                tipul = cols[5].text
                disciplina = cols[6].text
                profesor = cols[7].text
                
                c = curs(orare[0], orare[1], orare[2], ziua, orele, frecventa, sala, formatia, tipul, disciplina, profesor)
                toate_orele.append(c)

toate_orele.sort()
for ora in toate_orele:
    f.write(ora.to_string())

f.close()

print("DONE")

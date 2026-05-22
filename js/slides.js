/**
 * Sunum İçeriği ve Yönetimi
 */

const SlidesData = [
    {
        title: "Kuantum Dünyasına İlk Adım",
        content: "Geleceğin teknolojisine hoş geldiniz. Bugün, sağduyumuzun iflas ettiği ama evrenin gerçekte nasıl çalıştığını gösteren kuantum dünyasını keşfedeceğiz.",
        remember: "Kuantum dünyasında hiçbir şey göründüğü gibi değildir!",
        note: "Sunuma başlarken öğrencilerin ilgisini çekecek merak uyandırıcı bir giriş yapın."
    },
    {
        title: "Kuantum Nedir?",
        content: "Latince 'quantus' (ne kadar) kelimesinden gelir. Maddenin ve enerjinin en küçük, bölünemez parçalarına 'kuantum' diyoruz. Tıpkı pikseller gibi, evren de aslında 'parçacıklı' bir yapıya sahiptir.",
        remember: "Doğa kesintisiz değil, basamaklar (kuantlar) halindedir.",
        question: "Kuantum kelimesi ne anlama gelir?",
        options: ["Büyük", "Hızlı", "Kesikli/Parçalı", "Renkli"],
        answer: 2,
        note: "Merdiven ve rampa analojisini kullanın."
    },
    {
        title: "Siyah Cisim Işıması",
        content: "Klasik fizik, ısınan bir nesnenin sonsuz enerji yayacağını öngörüyordu (Ultraviyole Felaketi). Max Planck, enerjinin paketler (kuantlar) halinde yayıldığını keşfederek bu sorunu çözdü.",
        remember: "Planck sabiti (h), kuantum fiziğinin doğum belgesidir.",
        sim: "blackbody",
        note: "Simülasyonda sıcaklık arttıkça grafiğin nasıl değiştiğini gösterin."
    },
    {
        title: "Fotoelektrik Olay",
        content: "Işık, metal bir levhaya çarptığında elektron koparabilir. Ancak bu, ışığın parlaklığına değil, rengine (enerjisine) bağlıdır. Bu, ışığın parçacık (foton) gibi davrandığını kanıtlar.",
        remember: "Işık paketçiklerine 'foton' denir.",
        sim: "photoelectric",
        note: "Einstein'ın Nobel ödülünü bu çalışmasıyla aldığını belirtin."
    },
    {
        title: "Işığın ve Maddenin İkili Doğası",
        content: "Işık hem dalga hem de parçacık doğasına sahiptir. Louis de Broglie, sadece ışığın değil, elektron gibi maddenin de dalga özelliği gösterdiğini kanıtladı. Buna 'Dalga-Parçacık İkililiği' diyoruz.",
        remember: "Her şey aynı anda hem parçacık hem dalgadır; nasıl göründüğü sadece nasıl baktığınıza (ölçümünüze) bağlıdır.",
        question: "Madde dalgaları fikrini kim ortaya atmıştır?",
        options: ["Newton", "Einstein", "De Broglie", "Tesla"],
        answer: 2,
        note: "Dalga-parçacık ikililiği, kuantum mekaniğinin temelidir."
    },
    {
        title: "Çift Yarık Deneyi",
        content: "Kuantum dünyasının en ünlü deneyi! Tek bir elektronu iki yarıktan gönderdiğimizde, dalga gibi davranıp girişim deseni oluşturur. Ancak hangi yarıktan geçtiğine bakarsak (ölçüm yaparsak), parçacık gibi davranıp iki çizgi oluşturur.",
        remember: "Bakmak (ölçmek) sonucu değiştirir!",
        sim: "doubleslit",
        note: "Feynman'ın 'Kuantumun kalbi' dediği deneydir."
    },
    {
        title: "Belirsizlik İlkesi",
        content: "Werner Heisenberg'e göre, bir parçacığın konumunu ve hızını (momentumunu) aynı anda %100 kesinlikle bilemeyiz. Birini ne kadar net ölçersek, diğeri o kadar belirsizleşir.",
        remember: "Bu bir cihaz hatası değil, evrenin temel bir kuralıdır.",
        sim: "uncertainty",
        note: "Konum netleştikçe hızın sapıttığını görselleştirin."
    },
    {
        title: "Dalga Fonksiyonu ve Olasılık",
        content: "Erwin Schrödinger, kuantum sistemlerini 'Dalga Fonksiyonu' (psi - Ψ) ile tanımladı. Bu fonksiyon bize bir parçacığın nerede olduğunu değil, nerede olma 'olasılığını' söyler.",
        remember: "Kuantum dünyası kesinliklerle değil, olasılıklarla çalışır.",
        sim: "wavefunction",
        note: "Olasılık bulutu kavramını vurgulayın."
    },
    {
        title: "Schrödinger'in Kedisi",
        content: "Kutuda hem ölü hem canlı olduğu düşünülen o meşhur kedi! Bu bir gerçek deney değil, bir düşünce deneyidir. Amacı, kuantum dünyasındaki süperpozisyonun makro dünyaya ne kadar tuhaf geleceğini göstermektir.",
        remember: "Kedi aynı anda iki durumda da 'sayılabilir' ta ki biz bakana kadar.",
        question: "Schrödinger'in kedisi deneyi neyi anlatmak için kurgulanmıştır?",
        options: ["Hayvan haklarını", "Süperpozisyonu", "Yerçekimini", "Evrimi"],
        answer: 1,
        note: "Bunun bir paradoks olduğunu ve gerçekte kedilerin süperpozisyonda olamayacağını açıklayın."
    },
    {
        title: "Süperpozisyon",
        content: "Aynı anda hem 0 hem 1 olma durumudur. Bir qubit ölçülene kadar tüm olasılıkları içinde taşır. Ölçüldüğü an ise sadece bir duruma çöker.",
        remember: "Kutu açılana kadar kedi hem ölü hem canlıdır (Schrödinger'in Kedisi).",
        sim: "superposition",
        note: "Olasılıkların nasıl çöktüğünü (collapse) görselle anlatın."
    },
    {
        title: "Klasik vs Kuantum: Labirent Çözümü",
        content: `Klasik bir bilgisayar labirenti nasıl çözer? Bir yola girer, çıkmaz sokaksa geri döner ve diğerini dener. Tek tek...
        <br><br>
        Peki ya <strong>Kuantum Bilgisayar</strong>? Süperpozisyon sayesinde <strong>tüm yollara aynı anda</strong> girer! Hedefi bulduğunda ise yanlış olan tüm olasılıklar iptal olur ve doğru yol anında karşımıza çıkar.`,
        remember: "Klasik = Sırayla | Kuantum = Aynı Anda",
        sim: "mazeSim",
        note: "Hız farkını (Speedup) bu görsel üzerinden vurgulayın."
    },
    {
        title: "Qubit Nedir?",
        content: "Klasik bilgisayarlar 'Bit' kullanır (0 veya 1). Kuantum bilgisayarlar ise 'Qubit' kullanır. Qubitler süperpozisyon sayesinde çok daha karmaşık bilgileri aynı anda taşıyabilirler.",
        remember: "1 Bit = 1 değer | 1 Qubit = Olasılıklar havuzu.",
        sim: "qubit",
        question: "Kuantum bilgisayarların temel bilgi birimine ne denir?",
        options: ["Bit", "Byte", "Qubit", "Atom"],
        answer: 2,
        note: "Bit ve Qubit arasındaki farkı görselle destekleyin."
    },
    {
        title: "Kuantum Kapıları",
        content: "Klasik bilgisayarlardaki AND, OR, NOT kapıları yerine, kuantumda qubitlerin durumunu değiştiren 'Kuantum Kapıları' kullanılır. Örneğin Hadamard (H) kapısı, qubiti süperpozisyon durumuna sokar.",
        remember: "Hadamard (H) kapısı = Süperpozisyon oluşturucu.",
        sim: "gates",
        note: "H kapısının önemini vurgulayın."
    },
    {
        title: "Operatör Kavramı",
        content: `Kuantum mekaniğinde 'Kapılar' aslında matematiksel <strong>Operatörlerdir</strong>. Bir operatör, kuantum durumunu (vektörü) alır ve onu başka bir duruma dönüştürür.
        <div class="math-display">Durum_Yeni = Operatör * Durum_Eski</div>
        Matematiksel olarak her kapı 2x2'lik bir matristir. Bu matrisler lineer cebir kurallarına göre çalışır.`,
        remember: "Operatör = Değişim Makinesi",
        sim: "gates",
        note: "Operatörlerin sistem üzerindeki etkisini anlatın."
    },
    {
        title: "Matris İşlemleri: X|0⟩ Örneği",
        content: `Gelin X (NOT) kapısının |0⟩ durumu üzerindeki etkisini matris formunda görelim:
        <br><br>
        <div class="math-display">
            X * |0⟩ = <span class="matrix-bracket">[</span> 0 1 <span class="matrix-bracket">]</span> * <span class="matrix-bracket">[</span> 1 <span class="matrix-bracket">]</span> = <span class="matrix-bracket">[</span> 0 <span class="matrix-bracket">]</span> = |1⟩
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="matrix-bracket">[</span> 1 0 <span class="matrix-bracket">]</span>&nbsp;&nbsp;<span class="matrix-bracket">[</span> 0 <span class="matrix-bracket">]</span>&nbsp;&nbsp;<span class="matrix-bracket">[</span> 1 <span class="matrix-bracket">]</span>
        </div>
        <br>
        Matris çarpımı sonucunda vektörümüz ters dönerek |1⟩ durumuna ulaşır.`,
        remember: "Kuantum hesaplama aslında devasa matris çarpımlarıdır.",
        sim: "circuitSim",
        note: "Bu slaytta elle matris çarpımını kısaca gösterin."
    },
    {
        title: "Etkileşimli Operatör Laboratuvarı",
        content: `Şimdi teoriyi pratiğe dökelim! Aşağıdaki simülasyonda farklı kapıları seçerek, matris çarpımının qubitin durum vektörünü (Bloch Küresi üzerindeki oku) nasıl hareket ettirdiğini canlı olarak görün.
        <br><br>
        <strong>Deneyin:</strong>
        <ul>
            <li>|0⟩ durumundayken <strong>X Kapısı</strong> uygulayın.</li>
            <li>Ardından <strong>H Kapısı</strong> ile süperpozisyon oluşturun.</li>
            <li><strong>Z Kapısı</strong> ile fazın nasıl değiştiğini gözlemleyin.</li>
        </ul>`,
        remember: "Operatör (Kapı) matrisi ile Durum vektörünün çarpımı, yeni kuantum durumunu verir.",
        sim: "gateOperatorSim",
        note: "Matris çarpımı ve vektör hareketi arasındaki doğrudan ilişkiyi vurgulayın."
    },
    {
        title: "Tensör Çarpımı ve Çoklu Qubit",
        content: `Bir qubit tek başına bir dünya ise, iki qubit koca bir evrendir! <strong>Tensör Çarpımı (⊗)</strong>, qubitleri bir araya getirerek güçlerini birleştirmemizi sağlar.
        <br><br>
        <strong>Süper Güç Analojisi:</strong>
        <ul>
            <li>1 Qubit = 2 farklı seçeneği aynı anda tutar (0 ve 1).</li>
            <li>2 Qubit = 4 farklı seçeneği aynı anda tutar (00, 01, 10, 11).</li>
            <li>3 Qubit = 8 farklı seçeneği aynı anda tutar.</li>
        </ul>
        Her yeni qubit eklediğinizde, bilgisayarın gücü 2 katına çıkar! Sadece 300 qubit ile evrendeki atom sayısından daha fazla hesaplamayı <strong>aynı anda</strong> yapabilirsiniz.
        <div class="math-display" style="font-size: 0.9rem; opacity: 0.8;">
            Matematiksel Sembol: |0⟩ ⊗ |0⟩ = |00⟩
        </div>`,
        remember: "Qubit sayısı arttıkça güç toplama değil, çarpma (üstel) olarak artar!",
        sim: "circuitSim",
        note: "Üstel artışın (exponential growth) neden kuantum bilgisayarları devrimsel yaptığını anlatın."
    },
    {
        title: "Kuantum Dolanıklık",
        content: "İki parçacığın birbirine öyle sıkı bağlanmasıdır ki, aralarındaki mesafe ne kadar uzak olursa olsun, birinin durumunu ölçtüğünüzde diğeri anında etkilenir. Einstein buna 'Uzaktan Ürkütücü Etki' demiştir.",
        remember: "Dolanıklık, kuantum internetin ve ışınlamanın temelidir.",
        sim: "entanglement",
        note: "Dolanıklığın anlık bir iletişim değil, bir korelasyon olduğunu vurgulayın."
    },
    {
        title: "Kuantum Rastgelelik",
        content: "Klasik bilgisayarlardaki rastgelelik aslında karmaşık bir hesaplamadır (sahte rastgelelik). Kuantum rastgelelik ise doğanın kalbindeki gerçek, tahmin edilemez bir rastgeleliktir.",
        remember: "Kuantum zar atarsa, sonucu kimse önceden bilemez.",
        question: "Kuantum rastgeleliğin temel farkı nedir?",
        options: ["Daha yavaş olması", "Tahmin edilebilir olması", "Gerçekten rastgele olması", "Sadece 0 vermesi"],
        answer: 2,
        note: "Zar örneğini kullanın."
    },
    {
        title: "Birinci Kuantum Devrimi",
        content: "20. yüzyılın başında kuantum fiziğinin keşfiyle lazerler, transistörler ve MR cihazları icat edildi. Bugün kullandığınız telefonlar bu devrimin bir sonucudur.",
        remember: "Kuantum olmasaydı akıllı telefonlar da olmazdı.",
        question: "Aşağıdakilerden hangisi birinci kuantum devrimi meyvesidir?",
        options: ["Tekerlek", "Transistör", "Buharlı makine", "Pusula"],
        answer: 1,
        note: "Teknolojinin kuantuma ne kadar borçlu olduğunu gösterin."
    },
    {
        title: "İkinci Kuantum Devrimi",
        content: "Şimdi ise kuantum sistemlerini sadece gözlemlemekle kalmıyor, onları tek tek kontrol ediyoruz. Bu devrim kuantum bilgisayarları, kuantum interneti ve ultra hassas sensörleri getiriyor.",
        remember: "Artık kuantum dünyasının yolcusu değil, yöneticisiyiz.",
        question: "İkinci kuantum devriminin ana odağı nedir?",
        options: ["Gözlem yapmak", "Tekil kuantum kontrolü", "Ateşi bulmak", "Metal işlemek"],
        answer: 1,
        note: "Aktif kontrol ve manipülasyon vurgusu yapın."
    },
    {
        title: "Kuantum Bilgisayarlar",
        content: "Klasik bilgisayarların milyonlarca yılda çözebileceği bazı özel problemleri, kuantum bilgisayarlar dakikalar içinde çözebilir. İlaç tasarımı, malzeme bilimi ve optimizasyon ana alanlardır.",
        remember: "Her şeyi değil, bazı zor problemleri çok hızlı çözerler.",
        sim: "circuitSim",
        note: "Süper bilgisayar vs Kuantum bilgisayar kıyası yapın."
    },
    {
        title: "Kuantum Algoritmaları",
        content: "Kuantum bilgisayarlar için yazılan özel matematiksel yöntemlerdir. Shor algoritması şifre kırmak için, Grover algoritması ise veri aramak için tasarlanmıştır.",
        remember: "Donanım kadar yazılım (algoritma) da önemlidir.",
        question: "Hangi kuantum algoritması hızlı arama yapmayı sağlar?",
        options: ["Shor", "Grover", "Newton", "Dijkstra"],
        answer: 1,
        note: "Algoritmaların isimlerini kulak dolgunluğu için verin."
    },
    {
        title: "Kuantum Şifreleme ve QKD",
        content: "Kuantum Anahtar Dağıtımı (QKD), kuantum fiziği yasalarını kullanarak tamamen güvenli anahtarlar oluşturur. Eğer biri araya girip dinlemeye çalışırsa, kuantum durumu bozulur ve fark edilir.",
        remember: "Dinlenmesi fark edilebilen tek şifreleme yöntemidir.",
        sim: "qkd",
        note: "Alice, Bob ve Eve senaryosunu anlatın."
    },
    {
        title: "Kuantum İnternet",
        content: "Dolanık parçacıklar üzerinden kuantum bilgisayarların birbirine bağlanmasıdır. Bu, klasik internetin yerini almayacak, ancak verilerin ultra güvenli ve hızlı işlenmesini sağlayacaktır.",
        remember: "Bilginin değil, kuantum durumlarının aktığı bir ağ.",
        question: "Kuantum internet ne üzerinden çalışır?",
        options: ["Bakır kablo", "Dolanık parçacıklar", "Radyo dalgaları", "Ses dalgaları"],
        answer: 1,
        note: "Geleceğin iletişim altyapısı."
    },
    {
        title: "Kuantum Sensörler",
        content: "Kuantum durumları çevreye karşı çok hassastır. Bu hassasiyeti kullanarak yerçekimini, manyetik alanları ve zamanı (atomik saatler) inanılmaz bir kesinlikle ölçebiliriz.",
        remember: "En küçük değişimleri bile hisseden cihazlar.",
        question: "Kuantum sensörler neye karşı çok hassastır?",
        options: ["Sadece sıcaklığa", "Çevresel değişimlere", "İnsan sesine", "Gürültüye"],
        answer: 1,
        note: "Hassasiyetin hem dezavantaj (gürültü) hem avantaj (sensör) olduğunu belirtin."
    },
    {
        title: "Kuantum Programlama Araçları",
        content: `Kuantum dünyasını keşfetmek için sadece teorik bilgi yetmez, kod yazmak da gerekir! Bugün gerçek kuantum bilgisayarlar üzerinde bile kod koşturabileceğiniz harika araçlar var:
        <br><br>
        <ul class="resource-list">
            <li><strong>Qiskit (IBM):</strong> En popüler Python kütüphanesi. IBM'in kuantum bilgisayarlarına bağlanmanızı sağlar.</li>
            <li><strong>Cirq (Google):</strong> Google'ın kuantum işlemcileri (Sycamore gibi) için geliştirdiği araçtır.</li>
            <li><strong>QuTiP:</strong> Kuantum fiziği simülasyonları için standart araçtır; atomların ve ışığın etkileşimini hesaplar.</li>
            <li><strong>PennyLane:</strong> Kuantum Bilgisayarlar ile Yapay Zeka (Makine Öğrenmesi) dünyasını birleştirir.</li>
            <li><strong>Microsoft Q#:</strong> Kuantum hesaplama için özel olarak geliştirilmiş bir programlama dilidir.</li>
        </ul>`,
        remember: "Kuantum programlama için en önemli dil Python'dır.",
        sim: "circuitSim",
        note: "Öğrencilere bu kütüphanelerin isimlerini ve Python öğrenmenin önemini hatırlatın."
    },
    {
        title: "IBM Quantum ve Qiskit",
        content: `IBM, dünyadaki ilk kuantum bilgisayarları internet üzerinden herkese açan şirkettir. <strong>Qiskit</strong> ise bu sistemleri kontrol etmek için kullanılan en yaygın kütüphanedir.
        <br><br>
        <strong>Neler Yapabilirsiniz?</strong>
        <ul>
            <li>Gerçek bir kuantum bilgisayara (bulut üzerinden) kod gönderebilirsiniz.</li>
            <li>Devrelerinizi görselleştirebilir ve hatalarını ayıklayabilirsiniz.</li>
            <li>Zengin bir topluluk desteği ve eğitim belgeleri (Textbook) bulabilirsiniz.</li>
        </ul>`,
        remember: "IBM Quantum Experience ile evinizden gerçek kuantum bilgisayara bağlanabilirsiniz.",
        sim: "circuitSim",
        note: "Qiskit'in açık kaynaklı ve topluluk odaklı yapısından bahsedin."
    },
    {
        title: "Google Quantum ve Cirq",
        content: `Google, 2019 yılında 'Kuantum Üstünlüğü' (Quantum Supremacy) başarısını duyurarak adını tarihe yazdı. <strong>Cirq</strong> ise Google'ın kuantum donanımları için tasarlanmış kütüphanesidir.
        <br><br>
        <strong>Özellikleri:</strong>
        <ul>
            <li>Donanım mimarisine en yakın kodlama deneyimini sunar.</li>
            <li>Hibrit (Klasik + Kuantum) algoritmalar geliştirmek için idealdir.</li>
            <li>Google'ın kuantum bulut servislerine erişim sağlar.</li>
        </ul>`,
        remember: "Cirq, donanıma en yakın seviyede kontrol sağlar.",
        sim: "circuitSim",
        note: "Google'ın Sycamore işlemcisi ve kuantum üstünlüğü kavramını açıklayın."
    },
    {
        title: "Geleceğin Meslekleri",
        content: "Kuantum yazılımcılığı, kuantum donanım mühendisliği ve kuantum veri güvenliği uzmanlığı geleceğin en parlak meslekleri olacak. Bu alanda şimdiden yerinizi alabilirsiniz.",
        remember: "Yazılım dünyası kuantum ile yeniden yazılıyor.",
        question: "Hangisi yeni nesil bir kuantum mesleğidir?",
        options: ["Kuantum Algoritma Araştırmacısı", "Buhar Mühendisi", "Telgraf Operatörü", "At Arabası Sürücüsü"],
        answer: 0,
        note: "Öğrencileri kariyer için motive edin."
    },
    {
        title: "Öğrenciler İçin Yol Haritası",
        content: `Matematik (özellikle lineer cebir ve olasılık), temel programlama (Python) ve merak! Kuantum bilişime başlamak için ihtiyacınız olan en büyük araç merakınızdır.
        <br><br>
        <strong>Harika Bir Kaynak Tavsiyesi:</strong><br>
        Daha fazla etkileşimli simülasyon ve görselleştirme için St Andrews Üniversitesi'nin hazırladığı 
        <a href="https://www.st-andrews.ac.uk/physics/quvis/" target="_blank" class="resource-link">QuVIS</a> projesini mutlaka inceleyin.
        `,
        remember: "Öğrenmek için hiçbir zaman erken değildir.",
        note: "Önerilen kaynaklardan (Qiskit, QuVIS, T3 Vakfı eğitimleri vb.) bahsedin."
    },
    {
        title: "Mini Atölye: Kendi Simülasyonunu Değiştir",
        content: "Birazdan laboratuvar bölümünde simülasyonları göreceğiz. Orada sadece 'Dene' butonuna basmakla kalmayın, 'Kod Mantığı' kısmına bakarak parametreleri değiştirin.",
        remember: "Kod yazmak, kuantumu anlamanın en iyi yoludur.",
        note: "Laboratuvar bölümüne geçiş için heyecan uyandırın."
    },
    {
        title: "Soru-Cevap",
        content: "Aklınıza takılan her şeyi sorun. Kuantum dünyasında 'saçma soru' yoktur, çünkü bu dünya zaten yeterince saçma (ama gerçek!) görünür.",
        remember: "Soru sormak, bilim insanı olmanın ilk adımıdır.",
        note: "Öğrencilerin sorularını alıp tartışma ortamı yaratın."
    },
    {
        title: "Kuantumun Nobel Yıldızları (Son 20 Yıl)",
        content: `Kuantum fiziği sadece teorik bir hayal değil, en büyük bilimsel ödüllerle taçlandırılmış bir gerçektir. İşte son yıllarda bu alanı şekillendiren dehalar:
        <br><br>
        <ul class="resource-list">
            <li><strong>2022 - Alain Aspect, John Clauser, Anton Zeilinger:</strong> Dolanık fotonlar üzerindeki deneyleri ile kuantum bilgi biliminin temelini attılar.</li>
            <li><strong>2012 - Serge Haroche, David Wineland:</strong> Tekil kuantum sistemlerini, onları bozmadan ölçmeyi ve kontrol etmeyi başardılar.</li>
            <li><strong>2023 - Agostini, Krausz, L'Huillier:</strong> Elektronların süper hızlı hareketlerini izlemek için "attosaniye" ölçeğinde ışık atımları geliştirdiler.</li>
            <li><strong>2016 - Thouless, Haldane, Kosterlitz:</strong> Maddenin egzotik ve topolojik hallerini (kuantum bilgisayarlar için çok önemli) keşfettiler.</li>
        </ul>`,
        remember: "Nobel ödülleri, kuantumun ne kadar güvenilir ve test edilmiş bir bilim olduğunu kanıtlar.",
        note: "Bu bilim insanlarının azmini ve keşiflerinin bugünkü teknolojilere etkisini anlatın."
    },
    {
        title: "Eğitim Kaynakları",
        content: `Kuantum dünyasını daha derinlemesine keşfetmek için bu harika kaynakları kullanabilirsiniz:
        <br><br>
        <ul class="resource-list">
            <li><a href="https://quantum.cloud.ibm.com/" target="_blank" class="resource-link">IBM Quantum</a> - Gerçek kuantum bilgisayarlara erişim ve bulut platformu.</li>
            <li><a href="https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits" target="_blank" class="resource-link">IBM Learning</a> - Bitlerden devrelere kapsamlı kuantum kursu.</li>
            <li><a href="https://www.st-andrews.ac.uk/physics/quvis/" target="_blank" class="resource-link">QuVIS</a> - St Andrews Üniversitesi'nden interaktif kuantum mekaniği görselleştirmeleri.</li>
            <li><a href="https://phet.colorado.edu/tr/simulations/filter?subjects=physics&type=html" target="_blank" class="resource-link">PhET Simülasyonları</a> - Colorado Üniversitesi'nin ödüllü fizik simülasyonları.</li>
            <li><a href="https://algassert.com/quirk" target="_blank" class="resource-link">Quirk</a> - Sürükle-bırak mantığıyla çalışan anlık kuantum devre simülatörü.</li>
            <li><a href="https://lab.quantumflytrap.com/lab?mode=waves" target="_blank" class="resource-link">Quantum Flytrap</a> - Kuantum laboratuvarı, optik ve dalga simülasyonları.</li>
        </ul>`,
        remember: "En iyi öğrenme yolu, simülasyonlarla oynayarak keşfetmektir.",
        note: "Öğrencilere bu platformların ücretsiz olduğunu ve kendi projelerini geliştirebileceklerini hatırlatın."
    },
    {
        title: "Kapanış",
        content: "Kuantum yolculuğumuzun sonuna geldik. Geleceği şekillendirecek teknolojilerin bir parçası olmanız dileğiyle. Dinlediğiniz için teşekkürler!",
        remember: "Gelecek kuantumda!",
        note: "Kapanış teşekkürlerini sunun ve katılımcıları kutlayın."
    }
];

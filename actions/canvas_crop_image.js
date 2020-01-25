module.exports = {

// ------------------------------------------------ ---------------------
// Nazwa działania
//
// To jest nazwa akcji wyświetlanej w edytorze.
// ------------------------------------------------ ---------------------

nazwa: „Canvas Crop Image”,

// ------------------------------------------------ ---------------------
// Sekcja akcji
//
// To jest sekcja, w którą wpadnie akcja.
// ------------------------------------------------ ---------------------

sekcja: „Edycja obrazu”,

// ------------------------------------------------ ---------------------
// Action Subtitle
//
// Ta funkcja generuje napisy wyświetlane obok nazwy.
// ------------------------------------------------ ---------------------

podtytuł: funkcja (dane) {
	const storeTypes = ["", "Zmienna temp.", "Zmienna serwera", "Zmienna globalna"];
	return `$ {storeTypes [parseInt (data.storage)]} ($ {data.varName})`;
},

//https://github.com/LeonZ2019/
autor: „LeonZ”,
wersja: „1.1.0”,

// ------------------------------------------------ ---------------------
// Pola akcji
//
// To są pola dla akcji. Te pola są dostosowane
// poprzez utworzenie elementów o odpowiednich identyfikatorach w kodzie HTML. Te
// to także nazwy pól przechowywanych w danych JSON akcji.
// ------------------------------------------------ ---------------------

pola: [„storage”, „varName”, „align”, „align2”, „width”, „height”, „positionx”, „positiony”],

// ------------------------------------------------ ---------------------
// Command HTML
//
// Ta funkcja zwraca ciąg znaków zawierający HTML
// działania edycyjne. 
//
// Parametr „isEvent” będzie prawdziwy, jeśli zostanie użyta ta akcja
// na wydarzenie. Ze względu na ich charakter wydarzenia nie zawierają pewnych informacji,
// edytuj HTML, aby to odzwierciedlić.
//
// Parametr „data” przechowuje stałe dla wybranych elementów do użycia. 
// Każda jest tablicą: indeks 0 dla poleceń, indeks 1 dla zdarzeń.
// Nazwy to: sendTargets, członkowie, role, kanały, 
// wiadomości, serwery, zmienne
// ------------------------------------------------ ---------------------

html: function (isEvent, data) {
	powrót `
<div>
	<div style = "float: left; width: 45%;">
		Obraz źródłowy: <br>
		<select id = "storage" class = "round" onchange = "glob.refreshVariableList (this)">
			$ {data.variables [1]}
		</select> <br>
	</div>
	<div id = "varNameContainer" style = "float: right; width: 50%;">
		Nazwa zmiennej: <br>
		<input id = "varName" class = "round" type = "text" list = "variableList"> <br>
	</div>
</div> <br> <br> <br>
<div>
	<div style = "float: left; width: 50%;">
		Szerokość uprawy (bezpośredni rozmiar lub procent): <br>
		<input id = "width" class = "round" type = "text" value = "100%"> <br>
	</div>
	<div style = "float: right; width: 50%;">
		Wysokość uprawy (bezpośredni rozmiar lub procent): <br>
		<input id = "height" class = "round" type = "text" value = "100%"> <br>
	</div>
</div> <br> <br> <br>
	<div style = "float: left; width: 45%;">
		Wyrównanie: <br>
		<select id = "align" class = "round" onchange = "glob.onChange0 (this)">
			<wybrano wartość opcji = „0”> Lewy górny róg </option>
			<option value = "1"> Top Center </option>
			<option value = "2"> W prawym górnym rogu </option>
			<opcja wartość = "3"> Środkowa lewa </option>
			<option value = "4"> Środkowy środek </option>
			<option value = "5"> Środkowy prawy </option>
			<opcja wartość = "6"> Lewy dolny </option>
			<option value = "7"> Bottom Center </option>
			<option value = "8"> Prawy dół </option>
			<option value = "9"> Określone położenie </option>
		</select> <br>
	</div>
	<div id = "specific" style = "display: none; padding-left: 5%; float: left; width: 50%;">
		Dostosowanie niestandardowe: <br>
		<select id = "align2" class = "round">
			<wybrano wartość opcji = „0”> Lewy górny róg </option>
			<option value = "1"> Top Center </option>
			<option value = "2"> W prawym górnym rogu </option>
			<opcja wartość = "3"> Środkowa lewa </option>
			<option value = "4"> Środkowy środek </option>
			<option value = "5"> Środkowy prawy </option>
			<opcja wartość = "6"> Lewy dolny </option>
			<option value = "7"> Bottom Center </option>
			<option value = "8"> Prawy dół </option>
		</select> <br>
	</div>
</div> <br> <br>
<div id = "position" style = "display: none">
	<div style = "float: left; width: 50%;">
		Pozycja X: <br>
		<input id = "positionx" class = "round" type = "text" value = "0"> <br>
	</div>
	<div style = "float: right; width: 50%;">
		Pozycja Y: <br>
		<input id = "positiony" class = "round" type = "text" value = "0"> <br>
	</div>
</div> `
},

// ------------------------------------------------ ---------------------
// Kod początkowy edytora akcji
//
// Kiedy kod HTML zostanie zastosowany po raz pierwszy w edytorze akcji, ten kod
// jest również uruchamiany. Pomaga to dodać modyfikacje lub skonfigurować reakcję
// funkcje dla elementów DOM.
// ------------------------------------------------ ---------------------

init: function () {
	const {glob, document} = this;
	
	const position = document.getElementById ('position');
	const specific = document.getElementById („specific”);

	glob.onChange0 = funkcja (zdarzenie) {
		if (parseInt (event.value) === 9) {
			position.style.display = null;
			specific.style.display = null;
		} else {
			position.style.display = "none";
			specific.style.display = "none";
		}
	};
	
	glob.refreshVariableList (document.getElementById ('storage'));
	glob.onChange0 (document.getElementById ('align'));
},

// ------------------------------------------------ ---------------------
// Action Bot Function
//
// Jest to funkcja akcji w klasie Action bota.
// Pamiętaj, że wywołania zdarzeń nie będą miały dostępu do parametru „msg”, 
// więc pamiętaj o sprawdzeniu istnienia zmiennej zmiennej.
// ------------------------------------------------ ---------------------

akcja: funkcja (pamięć podręczna) {
	const Canvas = wymagany („canvas”);
	const data = cache.actions [cache.index];
	const storage = parseInt (data.storage);
	const varName = this.evalMessage (data.varName, pamięć podręczna);
	const imagedata = this.getVariable (storage, varName, cache);
	if (! imagedata) {
		this.callNextAction (pamięć podręczna);
		powrót;
	}
	const image = new Canvas.Image ();
	image.src = imagedata;
	let cropw = this.evalMessage (data.width, cache);
	let croph = this.evalMessage (data.height, cache);
	if (cropw.endsWith ('%')) {
		cropw = image.width * parseFloat (cropw) / 100;
	} else {
		cropw = parseFloat (cropw)
	}
	if (croph.endsWith ('%')) {
		croph = image.height * parseFloat (croph) / 100;
	} else {
		croph = parseFloat (croph);
	}
	const align = parseInt (data.align);
	niech pozycjax;
	niech pozycjonuje;
	przełącznik (wyrównanie) {
		przypadek 0:
			positionx = 0;
			positiony = 0;
			przerwa;
		przypadek 1:
			positionx = (cropw / 2) - (image.width / 2);
			positiony = 0;
			przerwa;
		przypadek 2:
			positionx = cropw - image.width;
			positiony = 0;
			przerwa;
		przypadek 3:
			positionx = 0;
			positiony = (croph / 2) - (image.height / 2);
			przerwa;
		przypadek 4:
			positionx = (cropw / 2) - (image.width / 2);
			positiony = (croph / 2) - (image.height / 2);
			przerwa;
		przypadek 5:
			positionx = cropw - image.width;
			positiony = (croph / 2) - (image.height / 2);
			przerwa;
		przypadek 6:
			positionx = 0;
			positiony = croph - image.height;
			przerwa;
		przypadek 7:
			positionx = (cropw / 2) - (image.width / 2);
			positiony = croph - image.height;
			przerwa;
		przypadek 8:
			positionx = cropw - image.width;
			positiony = croph - image.height;
			przerwa;
		przypadek 9:
			const align2 = parseInt (data.align2);
			const pX = parseFloat (this.evalMessage (data.positionx, cache));
			const pY = parseFloat (this.evalMessage (data.positiony, cache));
			przełącznik (align2) {
				przypadek 0:
					positionx = -pX;
					positiony = -pY;
					przerwa;
				przypadek 1:
					positionx = - (pX - (cropw / 2));
					positiony = -pY;
					przerwa;
				przypadek 2:
					positionx = - (pX - cropw);
					positiony = -pY;
					przerwa;
				przypadek 3:
					positionx = -pX;
					positiony = - (pY - (croph / 2));
					przerwa;
				przypadek 4:
					positionx = - (pX - (cropw / 2));
					positiony = - (pY - (croph / 2));
					przerwa;
				przypadek 5:
					positionx = - (pX - cropw);
					positiony = - (pY - (croph / 2));
					przerwa;
				przypadek 6:
					positionx = -pX;
					positiony = - (pY - croph);
					przerwa;
				przypadek 7:
					positionx = - (pX - (cropw / 2));
					positiony = - (pY - croph);
					przerwa;
				przypadek 8:
					positionx = - (pX - cropw);
					positiony = - (pY - croph);
					przerwa;
			}
			przerwa;
	}
	const canvas = Canvas.createCanvas (cropw, croph);
	const ctx = canvas.getContext ('2d');
	ctx.drawImage (image, positionx, positiony);
	const result = canvas.toDataURL („image / png”). replace („image / png”, „image / octet-stream”);
	this.storeValue (wynik, pamięć, varName, pamięć podręczna);
	this.callNextAction (pamięć podręczna);
},

// ------------------------------------------------ ---------------------
// Action Bot Mod
//
// Po zainicjowaniu bota ten kod jest uruchamiany. Korzystanie z bota
// Przestrzeń nazw DBM, w razie potrzeby można dodawać / modyfikować istniejące funkcje.
// Aby zmniejszyć konflikty między modami, pamiętaj o aliasie
// funkcje, które chcesz zastąpić.
// ------------------------------------------------ ---------------------

mod: function (DBM) {
}

}; // Koniec modułu
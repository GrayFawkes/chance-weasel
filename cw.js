var cw = new Vue({
	el: '#cw',
	data: {
		finalTable: [],
		fileInput: 'Choose file',
		message: 'Chance Weasel'
	},
	mounted() {

	},
	methods: {
		onFileChange(event) {

			var files = event.target.files || event.dataTransfer.files
			if (!files.length)
				return
			this.createInput(files[0])
		},
		createInput(file) {
			// console.log(file)
			this.fileInput = file.name
			let promise = new Promise((resolve, reject) => {

				var reader = new FileReader();
				var vm = this;
				reader.onload = e => {
					resolve((vm.fileinput = reader.result));
				}
				reader.readAsText(file);
			})

			promise.then(
				result => {
					this.parseFile(this.fileinput)
				},
				error => {
					/* handle an error */ 
					console.log(error);
				}
			)
		},
		parseFile(csv) {

			var file = csv.split('\n')
			var table = []
			var header = file[0].split(';')
			// console.log(header)

			for(var i = 1; i < file.length; i++) {

				var obj = {};
				var currentline = file[i].split(";")

				for(var j = 0; j < header.length; j++) {
					obj[header[j]] = currentline[j]
				}
				table.push(obj)
			}
			table.splice(0,2)
			// console.table(table)
			this.processTable(table)
		},
		processTable(table) {
			var tableTirage = []
			_.forEach(table, function(line) {
				// debugger
				if ( line['Tarif'] != undefined ) {
					var nbTicket = line['Tarif'].replace(/[^0-9\.]+/g, '')
					nbTicket = parseInt(nbTicket, 10)
					var url = line['Url billet'].split('ticketId=')
					var params = url[1].split('&ag=')
					var ticketID = params[0]
					var i = 0
					do {
						i = i + 1
						var newLine = {'ticketID': ticketID + '-' + i, 'out': false }
						tableTirage.push(newLine)
					} while (i < nbTicket)
				}
			})
			console.table(tableTirage)
		},
		tirage() {
			
		}
	}
})
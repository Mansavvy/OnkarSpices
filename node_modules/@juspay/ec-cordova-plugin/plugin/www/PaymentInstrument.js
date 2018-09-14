var instruments = {
	CARD: 'CARD',
	NET_BANKING: 'NB',
	WALLET: 'WALLET',
	SAVED_CARD: 'CARD'
}

Object.defineProperty(instruments, 'flagsForInstruments', {
	enumerable: false,
	value: function () {
		var instru = [];
		for(var ins in arguments) {
			if(ins in instruments) {
				instru.push(instruments[ins]);
			}
		}
		return instru.join('|');
	}
});

if('freeze' in Object) {
	instruments = Object.freeze(instruments);
}

module.exports = instruments;
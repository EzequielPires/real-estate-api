export function fullNumber(numero: number) {
    const unidades = [
      "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
      "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"
    ];
  
    const dezenas = [
      "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"
    ];
  
    const centenas = [
      "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"
    ];
  
    const milhares = [
      "", "mil", "milhão"
    ];
  
    if (numero === 0) {
      return "zero";
    }
  
    if (numero < 0) {
      return "menos " + fullNumber(Math.abs(numero));
    }
  
    let extenso = "";
  
    if (numero >= 1000000) {
      const milhao = Math.floor(numero / 1000000);
      extenso += fullNumber(milhao) + " " + milhares[2] + " ";
      numero %= 1000000;
    }
  
    if (numero >= 1000) {
      const milhar = Math.floor(numero / 1000);
      extenso += fullNumber(milhar) + " " + milhares[1] + " ";
      numero %= 1000;
    }
  
    if (numero >= 100) {
      const centena = Math.floor(numero / 100);
      extenso += centenas[centena] + " ";
      numero %= 100;
    }
  
    if (numero >= 20) {
      const dezena = Math.floor(numero / 10);
      extenso += dezenas[dezena] + " ";
      numero %= 10;
    }
  
    if (numero > 0) {
      extenso += unidades[numero] + " ";
    }
  
    return extenso.trim();
  }
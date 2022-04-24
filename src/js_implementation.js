// First segment's end index
let pos1 = -1;

// Third segment's start index
let pos2 = -1;

// This function returns true if the array
// can be divided into three equal sum segments
function equiSumUtil(arr) {
	let n = arr.length;

	// Prefix Sum Array
	let pre = new Array(n);
	let sum = 0, i;
	for (i = 0; i < n; i++) {
		sum += arr[i];
		pre[i] = sum;
	}

	// Suffix Sum Array
	let suf = new Array(n);
	sum = 0;
	for (i = n - 1; i >= 0; i--) {
		sum += arr[i];
		suf[i] = sum;
	}

	// Stores the total sum of the array
	let total_sum = sum;

	let j = n - 1;
	i = 0;
	while (i < j - 1) {

		if (pre[i] == total_sum / 3) {
			pos1 = i;
		}

		if (suf[j] == total_sum / 3) {
			pos2 = j;
		}

		if (pos1 != -1 && pos2 != -1) {

			// We can also take pre[pos2 - 1] - pre[pos1] ==
			// total_sum / 3 here.
			if (suf[pos1 + 1] - suf[pos2] == total_sum / 3) {
				return true;
			}
			else {
				return false;
			}
		}

		if (pre[i] < suf[j]) {
			i++;
		}
		else {
			j--;
		}
	}

	return false;
}

function equiSum(arr) {
	let ans = equiSumUtil(arr);
	let string = "";
	if (ans) {
		for (let i = 0; i <= pos1; i++) {
			string += arr[i] + ", ";
		}

		string += "and ";

		for (let i = pos1 + 1; i < pos2; i++) {
			string += arr[i] + ", ";
		}

		string += "and ";

		for (let i = pos2; i < arr.length; i++) {
			string += arr[i] + ", ";
		}

	}
	else {
		string = "Array cannot be divided into three equal sum segments";
	}
	return string;
}


function caller(arr) {
	return equiSum(arr);
}


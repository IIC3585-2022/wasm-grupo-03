// C++ implementation of the approach
#include <iostream>

using namespace std;

// First segment's end index
static int pos1 = -1;

// Third segment's start index
static int pos2 = -1;

// This function returns true if the array
// can be divided into three equal sum segments
bool equiSumUtil(int arr[], int n) {
  // Prefix Sum Arrays
  int pre[n];
  int sum = 0;
  for (int i = 0; i < n; i++) {
    sum += arr[i];
    pre[i] = sum;
  }

  // Suffix Sum Array
  int suf[n];
  sum = 0;
  for (int i = n - 1; i >= 0; i--) {
    sum += arr[i];
    suf[i] = sum;
  }

  // Stores the total sum of the array
  int total_sum = sum;

  int i = 0, j = n - 1;
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
      } else {
        return false;
      }
    }

    if (pre[i] < suf[j]) {
      i++;
    } else {
      j--;
    }
  }

  return false;
}

string equiSum(int arr[], int n) {
  bool ans = equiSumUtil(arr, n);
  string answer = "";
  if (ans) {
    answer += "First Segment : ";
    for (int i = 0; i <= pos1; i++) {
      answer += arr[i] + ", ";
    }

    answer += "and ";

    answer += "Second Segment : ";
    for (int i = pos1 + 1; i < pos2; i++) {
      answer += arr[i] + ", ";
    }

    answer += "and ";

    answer += "Third Segment : ";
    for (int i = pos2; i < n; i++) {
      answer += arr[i] + ", ";
    }
  } else {
    answer = "Array cannot be divided into three equal sum segments";
  }
  cout << answer;
  return answer;
}

// Driver code
extern "C" {
string caller(int arr[]) {
  int n = sizeof(arr) / sizeof(arr[0]);
  string res = equiSum(arr, n);
  cout << endl << res << endl;
  return res;
}
}

// This code is contributed by mits

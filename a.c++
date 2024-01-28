#include <iostream>
#include <vector>
#include <map>
#include <algorithm>


using namespace std;

int solve( int idx ,vector<int>damage,vector<int> size,vector<int>category,int barrackSize ,map<int,bool>taken,int n, vector<vector<int>>&dp){
    if(idx >= n ||barrackSize==0 ) return 0;
    if(dp[idx][barrackSize]!=-1) {
        if(!taken[category[idx]]){
           return dp[idx][barrackSize];
        }
        else{
           return 0;
        }
    } 
        
   
    int Take=0;
    map<int, bool> newTaken = taken;
    int noTake =  solve( idx+1,damage,size,category,barrackSize,taken,n,dp );
    
    if( barrackSize - size[idx] >=0 && taken[category[idx]] == false  ){
        newTaken[category[idx]] = true;
        Take = damage[idx] + solve(idx+1,damage,size,category,barrackSize-size[idx],newTaken,n,dp);
    }
     return dp[idx][barrackSize] = max(Take,noTake);
}



int main()
{
  
     vector<int> damage, size, category;
    int barrackSize,val;

  
    while (cin >> val) {
        damage.push_back(val);
        if (cin.get() == '\n') {
            break;
        }
    }

    
    while (cin >> val) {
        size.push_back(val);
        if (cin.get() == '\n') {
            break;
        }
    }


    while (cin >> val) {
        category.push_back(val);
        if (cin.get() == '\n') {
            break;
        }
    }


    cin >> barrackSize;




    map<int,bool>taken;
     
    int n = damage.size();
    vector<vector<int>>dp(n+1,vector<int>(barrackSize+1,-1));
    for(int i=0;i<n;i++){
        taken[category[i]] = false;
    }
    
    cout<<solve(0,damage,size,category,barrackSize,taken,n,dp);


    return 0;
}
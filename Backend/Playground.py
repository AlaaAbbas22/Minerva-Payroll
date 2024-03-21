import numpy as np
#matplotlib for graphing purposes
import matplotlib.pyplot as plt
#pandas for importing data
import pandas as pd
#stats for the tests using t distributions next
from scipy import stats
#mode function
from statistics import mode
#importing the data as a dataframe
url='https://docs.google.com/spreadsheets/d/e/2PACX-1vSfQ3i0Ir8-Lhrxhchg1Vs5StnN75Ll6a8i90UuO6uIg0IVO4Vg27UFuszjfhOlUptwFDFeLN3d3hqS/pub?output=csv'
df = pd.read_csv(url)

def sigtest(mlist, mlist2, siglevel, G):
    alpha = siglevel
    #degrees of freedom is the least sample size - 1
    df_all = min(len(mlist),len(mlist2))-1
    #standard error for the two samples as averaged of the two
    SE_all = ((np.std(mlist, ddof=1)**2/len(mlist))+(np.std(mlist2, ddof=1)**2/len(mlist2)))**0.5
    #T score for the difference
    T = (np.mean(mlist)-np.mean(mlist2))/SE_all
    #the probability to the right is 1 - that value. Made it absolute if there is negative rather than creating one with (1 minus bla bla) and one without if it was negative
    if G == "2":
        p_value = 2*(1-np.abs(stats.t.cdf(T,df_all)))
    elif G==">":
        p_value = 1 - stats.t.cdf(T,df_all)
    elif G=="<":
        p_value = stats.t.cdf(T,df_all)

    if p_value> alpha:
        res = "Do not reject the null hypothesis"
    else:
        res = "Reject the null hypothesis"

    g = ((np.mean(mlist)-np.mean(mlist2))/(((np.std(mlist, ddof=1)**2)*(len(mlist)-1)+(np.std(mlist2, ddof=1)**2)*(len(mlist2)-1))/(len(mlist)+len(mlist2)-2))**0.5)*(1-(3/(4*(len(mlist)+len(mlist2))-9)))

    return [p_value, g, res]
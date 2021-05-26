from django.shortcuts import render
from tethys_sdk.permissions import login_required


@login_required()
def home(request):
    return render(request, 'fierapp/home.html', {})

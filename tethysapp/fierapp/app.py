from tethys_sdk.base import TethysAppBase, url_map_maker


class Fierapp(TethysAppBase):
    """
    Tethys app class for SERVIR FIER Flood Extents.
    """

    name = 'SERVIR FIER Flood Extents'
    index = 'fierapp:home'
    icon = 'fierapp/images/icon.gif'
    package = 'fierapp'
    root_url = 'fierapp'
    color = '#7B9E7F'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='fierapp',
                controller='fierapp.controllers.home'
            ),
        )

        return url_maps
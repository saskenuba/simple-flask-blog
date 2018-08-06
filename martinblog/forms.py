import wtforms_json
wtforms_json.init()

from wtforms import Form, StringField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, Email, URL


class LoginForm(Form):
    username = StringField(
        u'Nome',
        validators=[DataRequired()],
        render_kw={'placeholder': 'Usuario', 'tabindex': '1'})
    password = PasswordField(
        u'Senha',
        validators=[DataRequired()],
        render_kw={'placeholder': 'Senha', 'tabindex': '2'})


class ContactForm(Form):
    formNome = StringField(u'Nome', validators=[DataRequired()])
    formEmail = StringField(u'Email', validators=[DataRequired(), Email()])
    formTelefone = StringField(u'Telefone (Opcional)')
    formMensagem = TextAreaField(u'Mensagem', validators=[DataRequired()])


class PortfolioForm(Form):
    title = StringField(
        u'Nome do Trabalho:',
        validators=[DataRequired()],
        render_kw={'placeholder': 'Data Analysis'})
    description = StringField(
        u'Descrição:',
        validators=[DataRequired()],
        render_kw={'placeholder': 'Este projeto trata-se de...'})

    imageUrl = StringField(
        u'URL de Imagem de Capa:',
        validators=[DataRequired(), URL()],
        render_kw={'placeholder': 'https://i.imgur.com/u6R67rw.jpg'})
    content = TextAreaField(u'Conteúdo', validators=[DataRequired()])

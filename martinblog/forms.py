import wtforms_json
from wtforms import (Form, PasswordField, SelectField, StringField,
                     TextAreaField)
from wtforms.validators import URL, DataRequired, Email

wtforms_json.init()


class LoginForm(Form):
    username = StringField(
        u'Nome',
        validators=[DataRequired()],
        render_kw={
            'placeholder': 'Usuario',
            'tabindex': '1'
        })
    password = PasswordField(
        u'Senha',
        validators=[DataRequired()],
        render_kw={
            'placeholder': 'Senha',
            'tabindex': '2'
        })


class ContactForm(Form):
    formNome = StringField(u'Nome', validators=[DataRequired()])
    formEmail = StringField(u'Email', validators=[DataRequired(), Email()])
    formTelefone = StringField(u'Telefone (Opcional)')
    formMensagem = TextAreaField(u'Mensagem', validators=[DataRequired()])


class PortfolioForm(Form):
    title = StringField(
        u'Título do trabalho:',
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


class PortfolioFormSelector(PortfolioForm):
    itemSelector = SelectField(u'Selecione o projeto:')

    # comment
    def fill(self, DBModel):
        self.itemSelector.choices = [(x.id, x.title)
                                     for x in DBModel.query.all()]

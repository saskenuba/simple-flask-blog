import wtforms_json
wtforms_json.init()

from wtforms import Form, StringField, TextAreaField
from wtforms.validators import DataRequired, Email


class ContactForm(Form):
    formNome = StringField('Nome', validators=[DataRequired()])
    formEmail = StringField('Email', validators=[DataRequired(), Email()])
    formTelefone = StringField('Telefone (Opcional)')
    formMensagem = TextAreaField('Mensagem', validators=[DataRequired()])
